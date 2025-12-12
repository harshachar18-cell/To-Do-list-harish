import './TodoStats.css';

function TodoStats({ todos, clearCompleted }) {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="todo-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>
      
      {completed > 0 && (
        <button className="clear-completed-btn" onClick={clearCompleted}>
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
}

export default TodoStats;
