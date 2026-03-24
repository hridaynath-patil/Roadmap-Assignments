// DOM Elements
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-completed');
const filterSpans = document.querySelectorAll('.filter-controls span');

// State
let todos = [];
let currentFilter = 'all';

// Form Submit
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = input.value.trim();
    
    if (taskText !== '') {
        addTodo(taskText);
        input.value = '';
        input.focus();
    }
});

// Add a Todo
function addTodo(text) {
    const todo = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    renderTodos();
}

// Toggle Todo Status
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

// Delete a Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Clear Completed
clearBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
});

// Filtering
filterSpans.forEach(span => {
    span.addEventListener('click', () => {
        // Update active class
        filterSpans.forEach(s => s.classList.remove('active'));
        span.classList.add('active');
        
        // Update filter state
        currentFilter = span.getAttribute('data-filter');
        renderTodos();
    });
});

// Render the list
function renderTodos() {
    // Clear current list
    todoList.innerHTML = '';
    
    // Filter the array
    let filteredTodos = todos;
    if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Check if empty
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks found here.</p>
            </div>
        `;
    } else {
        // Create elements for each todo
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" id="${todo.id}" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <label for="${todo.id}" class="custom-checkbox">
                    <i class="fas fa-check"></i>
                </label>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            // Add listeners to newly created elements
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));
            
            const delBtn = li.querySelector('.delete-btn');
            delBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            todoList.appendChild(li);
        });
    }
    
    // Update count
    const totalCount = todos.length;
    taskCount.textContent = `${totalCount} task${totalCount !== 1 ? 's' : ''} total`;
}

// Security helper to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Initial render
renderTodos();
