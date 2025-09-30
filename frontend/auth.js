// auth.js - universal auth & role handling

// ===== SESSION HANDLING =====
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('edu_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('edu_token') || null;
}

function setSession(user, token) {
  if (user) {
    localStorage.setItem('edu_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('edu_user');
  }
  if (token) {
    localStorage.setItem('edu_token', token);
  } else {
    localStorage.removeItem('edu_token');
  }
}

function clearSession() {
  localStorage.removeItem('edu_user');
  localStorage.removeItem('edu_token');
}

// ===== AUTH PROTECT =====
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location = 'login.html';
    return null;
  }
  return user;
}

// ===== ROLE HANDLING =====
function isTeacher() {
  const user = getCurrentUser();
  return user?.role === 'teacher';
}

function isParent() {
  const user = getCurrentUser();
  return user?.role === 'parent';
}

function isStudent() {
  const user = getCurrentUser();
  return user?.role === 'student';
}

// Hide/show elements marked for role restriction
function applyRoleVisibility() {
  const user = getCurrentUser();

  // Teacher-only elements
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isTeacher() ? '' : 'none';
  });

  // Parent-only elements
  document.querySelectorAll('.parent-only').forEach(el => {
    el.style.display = isParent() ? '' : 'none';
  });

  // Student-only elements
  document.querySelectorAll('.student-only').forEach(el => {
    el.style.display = isStudent() ? '' : 'none';
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
    clearSession();
    window.location = 'login.html';
    return null;
  }
  return res;
}

// ===== NAV UPDATE =====
function updateNav() {
  const user = getCurrentUser();
  const loginLink = document.querySelector('nav a[href="login.html"]');

  if (!loginLink) return;

  if (user) {
    loginLink.textContent = `Logout (${user.role})`;
    loginLink.onclick = (e) => {
      e.preventDefault();
      clearSession();
      window.location = 'login.html';
    };
  } else {
    loginLink.textContent = 'Login';
    loginLink.onclick = null;
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  applyRoleVisibility();
  updateNav();
});
