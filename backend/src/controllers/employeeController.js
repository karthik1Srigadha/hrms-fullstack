// src/controllers/employeeController.js
const { Employee, Team, EmployeeTeam } = require('../models');
const { createLog } = require('../services/logService');

async function listEmployees(req, res) {
  try {
    const organisationId = req.user.organisationId;

    const employees = await Employee.findAll({
      where: { organisationId },
      include: [
        { model: Team, as: "teams", through: { attributes: [] } }
      ],
      order: [['createdAt', 'DESC']],
    });

    const formatted = employees.map(e => ({
      id: e.id,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      phone: e.phone,
      teams: (e.teams || []).map(t => ({
        id: t.id,
        name: t.name,
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("listEmployees error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// getEmployee, createEmployee, updateEmployee, deleteEmployee: use organisationId keys
async function getEmployee(req, res) {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisationId;

    const employee = await Employee.findOne({
      where: { id, organisationId },
      include: [{ model: Team, as: "teams", through: { attributes: [] } }],
    });

    if (!employee) return res.status(404).json({ message: 'Not found' });
    res.json(employee);
  } catch (err) {
    console.error('getEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createEmployee(req, res) {
  try {
    const organisationId = req.user.organisationId;
    const userId = req.user.id;
    const { firstName, lastName, email, phone } = req.body;

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      organisationId,
    });

    await createLog({
      organisationId,
      userId,
      action: 'employee_created',
      meta: { employeeId: employee.id },
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error('createEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisationId;
    const userId = req.user.id;

    const employee = await Employee.findOne({ where: { id, organisationId } });
    if (!employee) return res.status(404).json({ message: 'Not found' });

    await employee.update(req.body);

    await createLog({
      organisationId,
      userId,
      action: 'employee_updated',
      meta: { employeeId: id },
    });

    res.json(employee);
  } catch (err) {
    console.error('updateEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisationId;
    const userId = req.user.id;

    const employee = await Employee.findOne({ where: { id, organisationId } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await EmployeeTeam.destroy({ where: { employeeId: id } });

await employee.destroy();


    await createLog({
      organisationId,
      userId,
      action: 'employee_deleted',
      meta: { employeeId: id },
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteEmployee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
