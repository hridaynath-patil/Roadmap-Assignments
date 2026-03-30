// ============================================================
// Assignment 15 – TypeScript To-Do App
// Demonstrates: Types, Interfaces, Functions with types,
//               Arrays, Objects, Generics
// ============================================================

// ── 1. Types ─────────────────────────────────────────────────
type TodoId = string;
type FilterType = "all" | "pending" | "completed";
type Priority = "low" | "medium" | "high";

// ── 2. Interface ──────────────────────────────────────────────
interface Todo {
  id: TodoId;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}

// ── 3. Generic helper ─────────────────────────────────────────
function getElementById<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

function querySelector<T extends HTMLElement>(
  parent: Element | Document,
  selector: string
): T {
  const el = parent.querySelector<T>(selector);
  if (!el) throw new Error(`Element "${selector}" not found`);
  return el;
}

// ── 4. DOM references (strongly typed) ───────────────────────
const form = getElementById<HTMLFormElement>("todo-form");
const input = getElementById<HTMLInputElement>("todo-input");
const prioritySelect = getElementById<HTMLSelectElement>("priority-select");
const todoList = getElementById<HTMLUListElement>("todo-list");
const taskCount = getElementById<HTMLSpanElement>("task-count");
const clearBtn = getElementById<HTMLButtonElement>("clear-completed");
const filterSpans = document.querySelectorAll<HTMLSpanElement>(
  ".filter-controls span"
);

// ── 5. State ──────────────────────────────────────────────────
let todos: Todo[] = [];
let currentFilter: FilterType = "all";

// ── 6. Type-safe functions ────────────────────────────────────

/** Creates and stores a new todo item */
function addTodo(text: string, priority: Priority): void {
  const todo: Todo = {
    id: Date.now().toString() as TodoId,
    text,
    completed: false,
    priority,
    createdAt: new Date(),
  };
  todos.push(todo);
  renderTodos();
}

/** Toggles the completed state of a todo by id */
function toggleTodo(id: TodoId): void {
  todos = todos.map(
    (todo: Todo): Todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
}

/** Removes a todo from the array by id */
function deleteTodo(id: TodoId): void {
  todos = todos.filter((todo: Todo): boolean => todo.id !== id);
  renderTodos();
}

/** Removes all completed todos */
function clearCompleted(): void {
  todos = todos.filter((todo: Todo): boolean => !todo.completed);
  renderTodos();
}

/** Filters todos based on current filter state */
function getFilteredTodos(): Todo[] {
  if (currentFilter === "pending") {
    return todos.filter((todo: Todo): boolean => !todo.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo: Todo): boolean => todo.completed);
  }
  return todos;
}

/** Counts todos by completed status */
function countTodos(): { total: number; completed: number; pending: number } {
  return {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };
}

/** Returns a priority badge HTML string */
function getPriorityBadge(priority: Priority): string {
  const classes: Record<Priority, string> = {
    low: "badge-low",
    medium: "badge-medium",
    high: "badge-high",
  };
  return `<span class="priority-badge ${classes[priority]}">${priority}</span>`;
}

/** Escapes HTML to prevent XSS */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Renders the todo list to the DOM */
function renderTodos(): void {
  todoList.innerHTML = "";
  const filtered: Todo[] = getFilteredTodos();

  if (filtered.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks found here.</p>
      </div>`;
  } else {
    filtered.forEach((todo: Todo): void => {
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

      const checkbox = querySelector<HTMLInputElement>(li, ".todo-checkbox");
      checkbox.addEventListener("change", (): void => toggleTodo(todo.id));

      const delBtn = querySelector<HTMLButtonElement>(li, ".delete-btn");
      delBtn.addEventListener("click", (): void => deleteTodo(todo.id));

      todoList.appendChild(li);
    });
  }

  const counts = countTodos();
  taskCount.textContent = `${counts.total} task${counts.total !== 1 ? "s" : ""} · ${counts.pending} pending`;
}

// ── 7. Event Listeners ────────────────────────────────────────

form.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  const text: string = input.value.trim();
  const priority: Priority = prioritySelect.value as Priority;
  if (text !== "") {
    addTodo(text, priority);
    input.value = "";
    input.focus();
  }
});

clearBtn.addEventListener("click", clearCompleted);

filterSpans.forEach((span: HTMLSpanElement): void => {
  span.addEventListener("click", (): void => {
    filterSpans.forEach((s: HTMLSpanElement): void =>
      s.classList.remove("active")
    );
    span.classList.add("active");
    currentFilter = (span.getAttribute("data-filter") as FilterType) ?? "all";
    renderTodos();
  });
});

// ── 8. Initial render ─────────────────────────────────────────
renderTodos();
