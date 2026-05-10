const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to create a project (Must be logged in AND an Admin)
router.post('/', protect, admin, createProject);

// Route to get all projects (Must be logged in)
router.get('/', protect, getProjects);

module.exports = router;