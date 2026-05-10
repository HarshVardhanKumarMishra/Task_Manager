const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTaskStatus } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin only: Create a task
router.post('/', protect, admin, createTask);

// Any logged-in user: Get tasks for a project & update status
router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;