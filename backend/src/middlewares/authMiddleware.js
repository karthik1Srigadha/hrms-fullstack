// src/middlewares/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models'); // models/index.js exports models

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.userId) return res.status(401).json({ message: 'Invalid token' });

    // include Organisation using alias exactly as defined in models/user.js
    const user = await User.findByPk(payload.userId, {
      include: [{ model: Organisation, as: 'organisation' }],
    });

    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      organisationId: user.organisationId,
    };
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authMiddleware };
