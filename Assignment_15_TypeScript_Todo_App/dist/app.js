"use strict";
// ============================================================
// Assignment 15 – TypeScript To-Do App
// Demonstrates: Types, Interfaces, Functions with types,
//               Arrays, Objects, Generics
// ============================================================
// ── 3. Generic helper ─────────────────────────────────────────
function getElementById(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Element #${id} not found`);
    return el;
}
function querySelector(parent, selector) {
    const el = parent.querySelector(selector);
    if (!el)
        throw new Error(`Element "${selector}" not found`);
    return el;
}
// ── 4. DOM references (strongly typed) ───────────────────────
const form = getElementById("todo-form");
const input = getElementById("todo-input");
const prioritySelect = getElementById("priority-select");
const todoList = getElementById("todo-list");
const taskCount = getElementById("task-count");
const clearBtn = getElementById("clear-completed");
const filterSpans = document.querySelectorAll(".filter-controls span");
// ── 5. State ──────────────────────────────────────────────────
let todos = [];
let currentFilter = "all";
// ── 6. Type-safe functions ────────────────────────────────────
/** Creates and stores a new todo item */
function addTodo(text, priority) {
    const todo = {
        id: Date.now().toString(),
        text,
        completed: false,
        priority,
        createdAt: new Date(),
    };
    todos.push(todo);
    renderTodos();
}
/** Toggles the completed state of a todo by id */
function toggleTodo(id) {
    todos = todos.map((todo) => todo.id === id ? Object.assign(Object.assign({}, todo), { completed: !todo.completed }) : todo);
    renderTodos();
}
/** Removes a todo from the array by id */
function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
}
/** Removes all completed todos */
function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    renderTodos();
}
/** Filters todos based on current filter state */
function getFilteredTodos() {
    if (currentFilter === "pending") {
        return todos.filter((todo) => !todo.completed);
    }
    if (currentFilter === "completed") {
        return todos.filter((todo) => todo.completed);
    }
    return todos;
}
/** Counts todos by completed status */
function countTodos() {
    return {
        total: todos.length,
        completed: todos.filter((t) => t.completed).length,
        pending: todos.filter((t) => !t.completed).length,
    };
}
/** Returns a priority badge HTML string */
function getPriorityBadge(priority) {
    const classes = {
        low: "badge-low",
        medium: "badge-medium",
        high: "badge-high",
    };
    return `<span class="priority-badge ${classes[priority]}">${priority}</span>`;
}
/** Escapes HTML to prevent XSS */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
/** Renders the todo list to the DOM */
function renderTodos() {
    todoList.innerHTML = "";
    const filtered = getFilteredTodos();
    if (filtered.length === 0) {
        todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks found here.</p>
      </div>`;
    }
    else {
        filtered.forEach((todo) => {
            const li = document.createElement("li");
            li.className = `todo-item ${todo.completed ? "completed" : ""}`;
            li.innerHTML = `
        <input type="checkbox" id="${todo.id}" class="todo-checkbox" ${todo.completed ? "checked" : ""}>
        <label for="${todo.id}" class="custom-checkbox">
          <i class="fas fa-check"></i>
        </label>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        ${getPriorityBadge(todo.priority)}
        <button class="delete-btn" data-id="${todo.id}" aria-label="Delete task">
          <i class="fas fa-trash-alt"></i>
        </button>`;
            const checkbox = querySelector(li, ".todo-checkbox");
            checkbox.addEventListener("change", () => toggleTodo(todo.id));
            const delBtn = querySelector(li, ".delete-btn");
            delBtn.addEventListener("click", () => deleteTodo(todo.id));
            todoList.appendChild(li);
        });
    }
    const counts = countTodos();
    taskCount.textContent = `${counts.total} task${counts.total !== 1 ? "s" : ""} · ${counts.pending} pending`;
}
// ── 7. Event Listeners ────────────────────────────────────────
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    const priority = prioritySelect.value;
    if (text !== "") {
        addTodo(text, priority);
        input.value = "";
        input.focus();
    }
});
clearBtn.addEventListener("click", clearCompleted);
filterSpans.forEach((span) => {
    span.addEventListener("click", () => {
        var _a;
        filterSpans.forEach((s) => s.classList.remove("active"));
        span.classList.add("active");
        currentFilter = (_a = span.getAttribute("data-filter")) !== null && _a !== void 0 ? _a : "all";
        renderTodos();
    });
});
// ── 8. Initial render ─────────────────────────────────────────
renderTodos();
