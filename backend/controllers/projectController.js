const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members, // Array of user IDs
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      // Admin sees all projects or projects they created
      projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email');
    } else {
      // Member sees only projects they are a member of
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects };
