// ============================================================
// Assignment 16 – TypeScript User Management App
// Demonstrates: Types, Interfaces, Functions with types,
//               Arrays, Objects, Generics
// ============================================================

// ── 1. Custom Types ──────────────────────────────────────────
type UserId = string;
type UserRole = "admin" | "editor" | "viewer";
type Department = "Engineering" | "Design" | "Marketing" | "HR" | "Finance";
type SortKey = "name" | "email" | "role" | "department";

// ── 2. Interfaces ─────────────────────────────────────────────
interface User {
  id: UserId;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  joinedAt: Date;
  avatar: string; // initials-based avatar colour
}

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  department: Department;
}

interface FilterState {
  search: string;
  role: UserRole | "all";
  sortBy: SortKey;
}

// ── 3. Generic helpers ────────────────────────────────────────
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

/** Generic sort utility */
function sortArray<T>(arr: T[], key: keyof T, asc = true): T[] {
  return [...arr].sort((a, b) => {
    const valA = String(a[key]).toLowerCase();
    const valB = String(b[key]).toLowerCase();
    return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
}

// ── 4. DOM References (strongly typed) ───────────────────────
const userForm = getElementById<HTMLFormElement>("user-form");
const nameInput = getElementById<HTMLInputElement>("name-input");
const emailInput = getElementById<HTMLInputElement>("email-input");
const roleSelect = getElementById<HTMLSelectElement>("role-select");
const deptSelect = getElementById<HTMLSelectElement>("dept-select");
const userGrid = getElementById<HTMLDivElement>("user-grid");
const userCount = getElementById<HTMLSpanElement>("user-count");
const searchInput = getElementById<HTMLInputElement>("search-input");
const filterRole = getElementById<HTMLSelectElement>("filter-role");
const sortSelect = getElementById<HTMLSelectElement>("sort-select");
const emptyState = getElementById<HTMLDivElement>("empty-state");
const formError = getElementById<HTMLParagraphElement>("form-error");

// ── 5. Avatar colour palette ──────────────────────────────────
const AVATAR_COLOURS: string[] = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

function getAvatarColour(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── 6. State ──────────────────────────────────────────────────
let users: User[] = [];
let filterState: FilterState = {
  search: "",
  role: "all",
  sortBy: "name",
};

// ── 7. Seed data ──────────────────────────────────────────────
const seedUsers: UserFormData[] = [
  { name: "Hridaynath Patil", email: "hridaynathpatil@example.com", role: "admin", department: "Marketing" },
  { name: "Bramha Deshmukh", email: "bramhadeshmukh@example.com", role: "editor", department: "Design" },
  { name: "Ameya Gadre", email: "ameyagadre@example.com", role: "viewer", department: "Engineering" },
];

// ── 8. Validation ─────────────────────────────────────────────
function validateUserForm(data: UserFormData): string | null {
  if (!data.name.trim() || data.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return "Please enter a valid email address.";
  }
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return "A user with this email already exists.";
  }
  return null;
}

// ── 9. Type-safe functions ────────────────────────────────────

/** Adds a new user after validation */
function addUser(data: UserFormData): void {
  const error: string | null = validateUserForm(data);
  if (error) {
    showError(error);
    return;
  }
  hideError();

  const newUser: User = {
    id: Date.now().toString() as UserId,
    name: data.name.trim(),
    email: data.email.toLowerCase(),
    role: data.role,
    department: data.department,
    joinedAt: new Date(),
    avatar: getAvatarColour(data.name),
  };

  users.push(newUser);
  renderUsers();
  resetForm();
}

/** Deletes a user from the list */
function deleteUser(id: UserId): void {
  users = users.filter((u: User): boolean => u.id !== id);
  renderUsers();
}

/** Returns filtered and sorted users */
function getFilteredUsers(): User[] {
  let result: User[] = [...users];

  if (filterState.search) {
    const q = filterState.search.toLowerCase();
    result = result.filter(
      (u: User): boolean =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
    );
  }

  if (filterState.role !== "all") {
    result = result.filter((u: User): boolean => u.role === filterState.role);
  }

  return sortArray<User>(result, filterState.sortBy as keyof User);
}

/** Returns role badge HTML */
function getRoleBadge(role: UserRole): string {
  const classes: Record<UserRole, string> = {
    admin: "badge-admin",
    editor: "badge-editor",
    viewer: "badge-viewer",
  };
  return `<span class="role-badge ${classes[role]}">${role}</span>`;
}

/** Formats a date nicely */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Renders the user grid */
function renderUsers(): void {
  const filtered: User[] = getFilteredUsers();

  userCount.textContent = `${users.length} user${users.length !== 1 ? "s" : ""} total`;
  userGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach((user: User): void => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.setAttribute("data-id", user.id);

    card.innerHTML = `
      <button class="delete-user-btn" data-id="${user.id}" aria-label="Delete ${user.name}">
        <i class="fas fa-times"></i>
      </button>
      <div class="user-avatar" style="background:${user.avatar}">
        ${getInitials(user.name)}
      </div>
      <div class="user-info">
        <h3 class="user-name">${escapeHtml(user.name)}</h3>
        <p class="user-email"><i class="fas fa-envelope"></i> ${escapeHtml(user.email)}</p>
        <p class="user-dept"><i class="fas fa-building"></i> ${user.department}</p>
        <div class="user-meta">
          ${getRoleBadge(user.role)}
          <span class="join-date"><i class="fas fa-calendar-alt"></i> ${formatDate(user.joinedAt)}</span>
        </div>
      </div>`;

    const delBtn = querySelector<HTMLButtonElement>(card, ".delete-user-btn");
    delBtn.addEventListener("click", (): void => deleteUser(user.id));

    userGrid.appendChild(card);
  });
}

/** Shows an error message in the form */
function showError(msg: string): void {
  formError.textContent = msg;
  formError.style.display = "block";
}

function hideError(): void {
  formError.textContent = "";
  formError.style.display = "none";
}

function resetForm(): void {
  userForm.reset();
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── 10. Event Listeners ───────────────────────────────────────

userForm.addEventListener("submit", (e: Event): void => {
  e.preventDefault();
  const data: UserFormData = {
    name: nameInput.value,
    email: emailInput.value,
    role: roleSelect.value as UserRole,
    department: deptSelect.value as Department,
  };
  addUser(data);
});

searchInput.addEventListener("input", (): void => {
  filterState = { ...filterState, search: searchInput.value };
  renderUsers();
});

filterRole.addEventListener("change", (): void => {
  filterState = { ...filterState, role: filterRole.value as UserRole | "all" };
  renderUsers();
});

sortSelect.addEventListener("change", (): void => {
  filterState = { ...filterState, sortBy: sortSelect.value as SortKey };
  renderUsers();
});

// ── 11. Seed & Init ───────────────────────────────────────────
seedUsers.forEach((data: UserFormData): void => {
  const user: User = {
    id: (Date.now() + Math.random()).toString() as UserId,
    name: data.name,
    email: data.email,
    role: data.role,
    department: data.department,
    joinedAt: new Date(Date.now() - Math.random() * 1e10),
    avatar: getAvatarColour(data.name),
  };
  users.push(user);
});

renderUsers();
