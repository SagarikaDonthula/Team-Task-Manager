const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createTask);
router.get('/', protect, getTasks);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
