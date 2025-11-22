// src/controllers/teamController.js
const { Team, Employee, EmployeeTeam, sequelize } = require('../models');
const { createLog } = require('../services/logService');

async function listTeams(req, res) {
  try {
    const organisationId = req.user.organisationId;

    const teams = await Team.findAll({
      where: { organisationId },
      include: [{ model: Employee, as: "members", through: { attributes: [] } }]


,
      order: [['createdAt', 'DESC']],
    });

    const formatted = teams.map(team => ({
      id: team.id,
      name: team.name,
      description: team.description || '',
     employees: (team.members || []).map(e => ({
  id: e.id,
  firstName: e.firstName,
  lastName: e.lastName
})),
memberCount: (team.members || []).length,

    }));

    res.json(formatted);
  } catch (err) {
    console.error('listTeams error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
async function createTeam(req, res) {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { name, description } = req.body;

    const team = await Team.create({
      name,
      description,
      organisationId,
    });

    await createLog({
      organisationId,
      userId,
      action: 'team_created',
      meta: { teamId: team.id },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error('createTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateTeam(req, res) {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisationId;
    const userId = req.user.id;

    const team = await Team.findOne({ where: { id, organisationId: organisationId } });
    if (!team) return res.status(404).json({ message: 'Not found' });

    await team.update(req.body);

    await createLog({
      organisationId,
      userId,
      action: 'team_updated',
      meta: { teamId: id },
    });

    res.json(team);
  } catch (err) {
    console.error('updateTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteTeam(req, res) {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisationId;
    const userId = req.user.id;

    const team = await Team.findOne({ where: { id, organisationId: organisationId } });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Remove assignments
    await EmployeeTeam.destroy({ where: { team_id: id } });

    await team.destroy();

    await createLog({
      organisationId,
      userId,
      action: 'team_deleted',
      meta: { teamId: id },
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteTeam error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * assignEmployees: replace the assignment list for a team
 * body: { employeeIds: [1,2,3] }
 */
async function assignEmployees(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { teamId } = req.params;
    const { employeeIds } = req.body;

    const team = await Team.findOne({
      where: { id: teamId, organisationId },
      transaction
    });

    if (!team) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Team not found' });
    }

    const employees = await Employee.findAll({
      where: { id: employeeIds, organisationId },
      transaction
    });

    const validIds = employees.map(e => e.id);

    // Remove old assignments
    await EmployeeTeam.destroy({ where: { teamId }, transaction });

    // Insert new assignments
    const rows = validIds.map(empId => ({ employeeId: empId, teamId }));
    await EmployeeTeam.bulkCreate(rows, { transaction });

    await createLog({
      organisationId,
      userId,
      action: 'team_assignment_updated',
      meta: { teamId, employeeIds: validIds },
    });

    await transaction.commit();
    res.json({ message: 'Assignments updated', assigned: validIds });

  } catch (err) {
    await transaction.rollback();
    console.error('assignEmployees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


module.exports = {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployees,
};
