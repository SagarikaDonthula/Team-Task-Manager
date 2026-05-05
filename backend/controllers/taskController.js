const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let tasks;
    const { projectId } = req.query; // Optional filter by project
    const filter = {};
    if (projectId) filter.projectId = projectId;

    if (req.user.role === 'Admin') {
      // Admin sees all tasks
      tasks = await Task.find(filter).populate('assignedTo', 'name email').populate('projectId', 'name');
    } else {
      // Member sees only their assigned tasks
      filter.assignedTo = req.user._id;
      tasks = await Task.find(filter).populate('assignedTo', 'name email').populate('projectId', 'name');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admins can update any task, Members can only update their assigned tasks
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status || task.status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus };
