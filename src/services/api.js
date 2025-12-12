import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

// Get all todos
export const getAllTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Get single todo by ID
export const getTodoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching todo:', error);
    throw error;
  }
};

// Create new todo
export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(API_URL, todoData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// Update todo
export const updateTodo = async (id, todoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, todoData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// Delete todo
export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// Delete all completed todos
export const deleteCompletedTodos = async () => {
  try {
    const response = await axios.delete(`${API_URL}/completed/all`);
    return response.data;
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    throw error;
  }
};
