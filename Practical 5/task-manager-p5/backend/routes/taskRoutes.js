const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const validateObjectId = require('../middleware/validateObjectId');

router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, updateTask)
  .delete(validateObjectId, deleteTask);

module.exports = router;
