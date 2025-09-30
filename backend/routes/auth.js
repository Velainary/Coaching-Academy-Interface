// auth.js - load this in every HTML page AFTER app.js

// ===== SESSION HANDLING =====
function getCurrentUser() {
  const raw = localStorage.getItem('edu_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('edu_token') || null;
}

// ===== AUTH PROTECT =====
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location = 'login.html';
  }
  return user;
}

// ===== ROLE HANDLING =====
function isTeacher() {
  const user = getCurrentUser();
  return user && user.role === 'teacher';
}

// Hide/show admin sections
function applyRoleVisibility() {
  const user = getCurrentUser();
  if (!user) return;

  // Elements only teachers should see
  document.querySelectorAll('.admin-only').forEach(el => {
    if (!isTeacher()) {
      el.style.display = 'none';  // hide from students/parents
    } else {
      el.style.display = '';      // visible for teachers
    }
  });
}

// ===== FETCH WRAPPER =====
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  options.headers = headers;

  const res = await fetch(url, options);
  if (res.status === 401) {
    alert('Session expired, please login again.');
    localStorage.removeItem('edu_user');
    localStorage.removeItem('edu_token');
    window.location = 'login.html';
    return;
  }
  return res;
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  applyRoleVisibility();
});
