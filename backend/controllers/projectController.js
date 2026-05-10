const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;

        const project = await Project.create({
            title,
            description,
            createdBy: req.user._id // We get this from the 'protect' middleware
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name email');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { createProject, getProjects };