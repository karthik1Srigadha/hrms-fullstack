// src/routes/teams.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployees,
} = require('../controllers/teamController');

router.use(authMiddleware);

router.get('/', listTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

// assign employees
router.post('/:teamId/assign', assignEmployees);

module.exports = router;
