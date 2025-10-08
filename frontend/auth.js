// ====== FRONTEND AUTH.JS ======

// --- Session helpers ---
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("edu_user"));
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem("edu_token");
}

function logout() {
  localStorage.removeItem("edu_user");
  localStorage.removeItem("edu_token");
  window.location = "login.html";
}

// --- Auth protection ---
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    alert("Please log in first.");
    window.location = "login.html";
    return false;
  }
  return true;
}

// --- Role check ---
function isTeacher() {
  const user = getCurrentUser();
  return user && user.role === "teacher";
}

// --- Role-based visibility ---
function applyRoleVisibility() {
  const user = getCurrentUser();
  if (!user) return;

  document.querySelectorAll(".admin-only").forEach((el) => {
    el.style.display = isTeacher() ? "" : "none";
  });
}

// --- Token-aware fetch wrapper ---
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["Content-Type"] = headers["Content-Type"] || "application/json";

  options.headers = headers;

  const res = await fetch(url, options);

  if (res.status === 401 || res.status === 403) {
    alert("Session expired or unauthorized. Please log in again.");
    logout();
    return;
  }

  return res;
}

// --- Show logged-in user info in navbar ---
function updateNavbarUser() {
  const user = getCurrentUser();
  const navLogin = document.querySelector(".nav-login");

  if (!navLogin) return;
  if (user) {
    navLogin.textContent = `Logout (${user.role})`;
    navLogin.href = "#";
    navLogin.onclick = (e) => {
      e.preventDefault();
      logout();
    };
  } else {
    navLogin.textContent = "Login";
    navLogin.href = "login.html";
  }
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  applyRoleVisibility();
  updateNavbarUser();
});
