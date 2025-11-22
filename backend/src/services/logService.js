// src/services/logService.js
const { Log } = require('../models');

async function createLog({ organisationId, userId, action, meta = {} }) {
  try {
    await Log.create({
      action,
      meta,
      organisationId: organisationId || null,
      userId: userId || null,
    });
  } catch (err) {
    console.error('createLog error:', err);
  }
}

module.exports = { createLog };
