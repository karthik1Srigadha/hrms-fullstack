// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User } = require('../models'); // uses models/index.js
const { createLog } = require('../services/logService');
require('dotenv').config();

async function register(req, res) {
  try {
    const { orgName, adminName, email, password } = req.body;
    if (!orgName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const organisation = await Organisation.create({ name: orgName });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: adminName || 'Admin',
      email,
      passwordHash,
      organisationId: organisation.id, // camelCase FK
    });

    const token = jwt.sign({ userId: user.id, orgId: organisation.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    await createLog({
      organisationId: organisation.id,
      userId: user.id,
      action: 'organisation_created',
      meta: { orgName },
    });

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      organisation: { id: organisation.id, name: organisation.name },
    });
  } catch (err) {
    console.error('Auth register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // include Organisation using alias defined in models
    const user = await User.findOne({
      where: { email },
      include: [{ model: Organisation, as: 'organisation' }],
    });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, orgId: user.organisationId }, process.env.JWT_SECRET, { expiresIn: '8h' });

    await createLog({
      organisationId: user.organisationId,
      userId: user.id,
      action: 'user_logged_in',
      meta: {},
    });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      organisationId: user.organisationId,
    });
  } catch (err) {
    console.error('Auth login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
