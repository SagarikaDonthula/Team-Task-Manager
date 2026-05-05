const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .put(protect, admin, updateProject);

module.exports = router;
