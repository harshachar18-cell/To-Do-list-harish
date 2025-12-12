import { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo._id, editText.trim(), editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#48dbfb';
      default: return '#ffa502';
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}>
      <div className="todo-content">
        <div className="todo-left">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo._id)}
          />
          
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                autoFocus
              />
              <select
                className="edit-priority"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          ) : (
            <div className="todo-text-container">
              <span className="todo-text">{todo.text}</span>
              <span 
                className="priority-badge" 
                style={{ backgroundColor: getPriorityColor(todo.priority) }}
              >
                {todo.priority}
              </span>
            </div>
          )}
        </div>

        <div className="todo-actions">
          {isEditing ? (
            <>
              <button className="btn btn-save" onClick={handleEdit}>
                ✓
              </button>
              <button className="btn btn-cancel" onClick={handleCancel}>
                ✕
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-edit" 
                onClick={() => setIsEditing(true)}
                disabled={todo.completed}
              >
                ✎
              </button>
              <button 
                className="btn btn-delete" 
                onClick={() => onDelete(todo._id)}
              >
                🗑
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
