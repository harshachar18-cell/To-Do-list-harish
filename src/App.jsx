import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';
import * as api from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load todos from MongoDB on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos. Make sure the server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Add new todo
  const addTodo = async (text, priority = 'medium') => {
    try {
      const newTodo = await api.createTodo({ text, priority });
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error:', err);
    }
  };

  // READ - Filter todos based on status and search
  const getFilteredTodos = () => {
    let filtered = todos;

    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // UPDATE - Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const updatedTodo = await api.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t._id === id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error:', err);
    }
  };

  // UPDATE - Edit todo text
  const editTodo = async (id, newText, newPriority) => {
    try {
      const updatedTodo = await api.updateTodo(id, { text: newText, priority: newPriority });
      setTodos(todos.map(t => t._id === id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to edit todo');
      console.error('Error:', err);
    }
  };

  // DELETE - Remove todo
  const deleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error:', err);
    }
  };

  // DELETE - Clear all completed todos
  const clearCompleted = async () => {
    try {
      await api.deleteCompletedTodos();
      setTodos(todos.filter(t => !t.completed));
    } catch (err) {
      setError('Failed to clear completed todos');
      console.error('Error:', err);
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="title-icon">✓</span>
            Advanced Todo List
          </h1>
          <p className="subtitle">Manage your tasks with CRUD Operations + MongoDB</p>
        </header>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading todos from database...</p>
          </div>
        ) : (
          <>
            <TodoStats 
              todos={todos} 
              clearCompleted={clearCompleted}
            />

            <TodoForm onAdd={addTodo} />

            <TodoFilter 
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />

            {filteredTodos.length === 0 && todos.length > 0 && (
              <div className="empty-state">
                <p>No tasks found matching your criteria</p>
              </div>
            )}

            {todos.length === 0 && (
              <div className="empty-state">
                <p>🎯 No tasks yet! Add one above to get started.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
