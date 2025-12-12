import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompletedTodos
} from '../controllers/todoController.js';

const router = express.Router();

// GET all todos
router.get('/', getTodos);

// GET single todo by ID
router.get('/:id', getTodoById);

// POST create new todo
router.post('/', createTodo);

// PUT update todo by ID
router.put('/:id', updateTodo);

// DELETE single todo by ID
router.delete('/:id', deleteTodo);

// DELETE all completed todos
router.delete('/completed/all', deleteCompletedTodos);

export default router;
