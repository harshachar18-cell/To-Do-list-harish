// Todo App - Vanilla JavaScript with MongoDB Backend

const API_URL = 'http://localhost:5000/api/todos';

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.editingId = null;

        this.initElements();
        this.attachEventListeners();
        this.loadTodos();
    }

    initElements() {
        // Form elements
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        
        // Filter elements
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById('searchInput');
        
        // Display elements
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.noResults = document.getElementById('noResults');
        
        // Stats elements
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        this.progressPercent = document.getElementById('progressPercent');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
    }

    attachEventListeners() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.render();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });
    }

    // CREATE - Add new todo to MongoDB
    async addTodo() {
        const text = this.todoInput.value.trim();
        const priority = this.prioritySelect.value;

        if (!text) return;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, priority })
            });

            if (!response.ok) throw new Error('Failed to add todo');
            
            await this.loadTodos();

            // Reset form
            this.todoInput.value = '';
            this.prioritySelect.value = 'medium';
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Failed to add task. Make sure the server is running on port 5000.');
        }
    }

    // READ - Get filtered todos
    getFilteredTodos() {
        let filtered = [...this.todos];

        // Filter by status
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        // Filter by search term
        if (this.searchTerm) {
            filtered = filtered.filter(todo =>
                todo.text.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        return filtered;
    }

    // UPDATE - Toggle todo completion in MongoDB
    async toggleTodo(id) {
        try {
            const todo = this.todos.find(t => t._id === id);
            if (!todo) return;

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    text: todo.text,
                    priority: todo.priority,
                    completed: !todo.completed 
                })
            });

            if (!response.ok) throw new Error('Failed to update todo');
            
            await this.loadTodos();
        } catch (error) {
            console.error('Error toggling todo:', error);
            alert('Failed to update task.');
        }
    }

    // UPDATE - Edit todo
    startEdit(id) {
        this.editingId = id;
        this.render();
    }

    // UPDATE - Save edited todo to MongoDB
    async saveEdit(id, newText, newPriority) {
        if (!newText.trim()) return;

        try {
            const todo = this.todos.find(t => t._id === id);
            if (!todo) return;

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    text: newText.trim(), 
                    priority: newPriority,
                    completed: todo.completed
                })
            });

            if (!response.ok) throw new Error('Failed to update todo');
            
            this.editingId = null;
            await this.loadTodos();
        } catch (error) {
            console.error('Error saving edit:', error);
            alert('Failed to save changes.');
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    // DELETE - Remove todo from MongoDB
    async deleteTodo(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete todo');
            
            await this.loadTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete task.');
        }
    }

    // DELETE - Clear all completed from MongoDB
    async clearCompleted() {
        try {
            const response = await fetch(`${API_URL}/completed/all`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to clear completed');
            
            await this.loadTodos();
        } catch (error) {
            console.error('Error clearing completed:', error);
            alert('Failed to clear completed tasks.');
        }
    }

    // Filter
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.render();
    }

    // Load todos from MongoDB
    async loadTodos() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch todos');
            
            this.todos = await response.json();
            this.render();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.todos = [];
            this.render();
            // Show error message to user
            alert('Failed to load tasks from MongoDB. Make sure the server is running on port 5000 and MongoDB is running on port 27017.');
        }
    }

    // Update statistics
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
        this.progressPercent.textContent = `${progress}%`;

        // Show/hide clear completed button
        if (completed > 0) {
            this.clearCompletedBtn.style.display = 'block';
        } else {
            this.clearCompletedBtn.style.display = 'none';
        }
    }

    // Render todo item
    renderTodoItem(todo) {
        const isEditing = this.editingId === todo._id;
        
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        if (isEditing) {
            div.innerHTML = `
                <div class="todo-content">
                    <div class="todo-left">
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} disabled>
                        <div class="edit-form">
                            <input 
                                type="text" 
                                class="edit-input" 
                                value="${this.escapeHtml(todo.text)}"
                                id="edit-input-${todo._id}"
                            >
                            <select class="edit-priority" id="edit-priority-${todo._id}">
                                <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                                <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                            </select>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-save" data-action="save" data-id="${todo._id}">✓</button>
                        <button class="btn btn-cancel" data-action="cancel">✕</button>
                    </div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="todo-content">
                    <div class="todo-left">
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo._id}">
                        <div class="todo-text-container">
                            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                            <span class="priority-badge ${todo.priority}">${todo.priority}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-edit" data-action="edit" data-id="${todo._id}" ${todo.completed ? 'disabled' : ''}>✎</button>
                        <button class="btn btn-delete" data-action="delete" data-id="${todo._id}">🗑</button>
                    </div>
                </div>
            `;
        }

        // Attach event listeners
        const checkbox = div.querySelector('.todo-checkbox:not([disabled])');
        if (checkbox) {
            checkbox.addEventListener('change', () => this.toggleTodo(todo._id));
        }

        const editBtn = div.querySelector('[data-action="edit"]');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.startEdit(todo._id));
        }

        const deleteBtn = div.querySelector('[data-action="delete"]');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo._id));
        }

        const saveBtn = div.querySelector('[data-action="save"]');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const input = document.getElementById(`edit-input-${todo._id}`);
                const select = document.getElementById(`edit-priority-${todo._id}`);
                this.saveEdit(todo._id, input.value, select.value);
            });
        }

        const cancelBtn = div.querySelector('[data-action="cancel"]');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }

        return div;
    }

    // Render all todos
    render() {
        const filteredTodos = this.getFilteredTodos();

        // Clear list
        this.todoList.innerHTML = '';

        // Show/hide empty states
        if (this.todos.length === 0) {
            this.emptyState.style.display = 'block';
            this.noResults.style.display = 'none';
        } else if (filteredTodos.length === 0) {
            this.emptyState.style.display = 'none';
            this.noResults.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
            this.noResults.style.display = 'none';

            // Render todos
            filteredTodos.forEach(todo => {
                this.todoList.appendChild(this.renderTodoItem(todo));
            });
        }

        // Update statistics
        this.updateStats();
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
