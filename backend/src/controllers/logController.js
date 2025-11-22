// src/controllers/logController.js
const { Log, User } = require('../models/index');

async function listLogs(req, res) {
  try {
    const organisationId = req.user.organisationId;

    const logs = await Log.findAll({
      where: { organisationId: organisationId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit: 200,
    });

    res.json(logs);
  } catch (err) {
    console.error('listLogs error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listLogs };
