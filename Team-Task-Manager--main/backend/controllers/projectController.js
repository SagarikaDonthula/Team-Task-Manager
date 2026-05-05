const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // verify members exist
    let validMembers = [];
    if (members && members.length > 0) {
      const users = await User.find({ _id: { $in: members } });
      validMembers = users.map(u => u._id);
    }

    const project = new Project({
      name,
      description,
      createdBy: req.user._id,
      members: validMembers,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({}).populate('createdBy', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project (add members, etc) - optional but useful
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      if (members) {
        project.members = members;
      }
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, updateProject };
