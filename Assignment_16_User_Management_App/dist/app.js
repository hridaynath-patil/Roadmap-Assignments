"use strict";
// ============================================================
// Assignment 16 – TypeScript User Management App
// Demonstrates: Types, Interfaces, Functions with types,
//               Arrays, Objects, Generics
// ============================================================
// ── 3. Generic helpers ────────────────────────────────────────
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
/** Generic sort utility */
function sortArray(arr, key, asc = true) {
    return [...arr].sort((a, b) => {
        const valA = String(a[key]).toLowerCase();
        const valB = String(b[key]).toLowerCase();
        return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
}
// ── 4. DOM References (strongly typed) ───────────────────────
const userForm = getElementById("user-form");
const nameInput = getElementById("name-input");
const emailInput = getElementById("email-input");
const roleSelect = getElementById("role-select");
const deptSelect = getElementById("dept-select");
const userGrid = getElementById("user-grid");
const userCount = getElementById("user-count");
const searchInput = getElementById("search-input");
const filterRole = getElementById("filter-role");
const sortSelect = getElementById("sort-select");
const emptyState = getElementById("empty-state");
const formError = getElementById("form-error");
// ── 5. Avatar colour palette ──────────────────────────────────
const AVATAR_COLOURS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
    "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];
function getAvatarColour(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}
function getInitials(name) {
    return name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => { var _a, _b; return (_b = (_a = w[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : ""; })
        .join("");
}
// ── 6. State ──────────────────────────────────────────────────
let users = [];
let filterState = {
    search: "",
    role: "all",
    sortBy: "name",
};
// ── 7. Seed data ──────────────────────────────────────────────
const seedUsers = [
    { name: "Hridaynath Patil", email: "hridaynathpatil@example.com", role: "admin", department: "Marketing" },
    { name: "Bramha Deshmukh", email: "bramhadeshmukh@example.com", role: "editor", department: "Design" },
    { name: "Ameya Gadre", email: "ameyagadre@example.com", role: "viewer", department: "Engineering" },
];
// ── 8. Validation ─────────────────────────────────────────────
function validateUserForm(data) {
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
function addUser(data) {
    const error = validateUserForm(data);
    if (error) {
        showError(error);
        return;
    }
    hideError();
    const newUser = {
        id: Date.now().toString(),
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
function deleteUser(id) {
    users = users.filter((u) => u.id !== id);
    renderUsers();
}
/** Returns filtered and sorted users */
function getFilteredUsers() {
    let result = [...users];
    if (filterState.search) {
        const q = filterState.search.toLowerCase();
        result = result.filter((u) => u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q));
    }
    if (filterState.role !== "all") {
        result = result.filter((u) => u.role === filterState.role);
    }
    return sortArray(result, filterState.sortBy);
}
/** Returns role badge HTML */
function getRoleBadge(role) {
    const classes = {
        admin: "badge-admin",
        editor: "badge-editor",
        viewer: "badge-viewer",
    };
    return `<span class="role-badge ${classes[role]}">${role}</span>`;
}
/** Formats a date nicely */
function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
/** Renders the user grid */
function renderUsers() {
    const filtered = getFilteredUsers();
    userCount.textContent = `${users.length} user${users.length !== 1 ? "s" : ""} total`;
    userGrid.innerHTML = "";
    if (filtered.length === 0) {
        emptyState.style.display = "flex";
        return;
    }
    emptyState.style.display = "none";
    filtered.forEach((user) => {
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
        const delBtn = querySelector(card, ".delete-user-btn");
        delBtn.addEventListener("click", () => deleteUser(user.id));
        userGrid.appendChild(card);
    });
}
/** Shows an error message in the form */
function showError(msg) {
    formError.textContent = msg;
    formError.style.display = "block";
}
function hideError() {
    formError.textContent = "";
    formError.style.display = "none";
}
function resetForm() {
    userForm.reset();
}
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// ── 10. Event Listeners ───────────────────────────────────────
userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        name: nameInput.value,
        email: emailInput.value,
        role: roleSelect.value,
        department: deptSelect.value,
    };
    addUser(data);
});
searchInput.addEventListener("input", () => {
    filterState = Object.assign(Object.assign({}, filterState), { search: searchInput.value });
    renderUsers();
});
filterRole.addEventListener("change", () => {
    filterState = Object.assign(Object.assign({}, filterState), { role: filterRole.value });
    renderUsers();
});
sortSelect.addEventListener("change", () => {
    filterState = Object.assign(Object.assign({}, filterState), { sortBy: sortSelect.value });
    renderUsers();
});
// ── 11. Seed & Init ───────────────────────────────────────────
seedUsers.forEach((data) => {
    const user = {
        id: (Date.now() + Math.random()).toString(),
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
