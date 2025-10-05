// frontend/js/auth.js
// Load this script in every page (after app.js or main logic)

// ===== USER + TOKEN HELPERS =====
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('edu_user') || 'null');
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('edu_token');
}

// ===== AUTH STATE HANDLERS =====
function setLoginState(user, token) {
  localStorage.setItem('edu_user', JSON.stringify(user));
  localStorage.setItem('edu_token', token);
}

function clearLoginState() {
  localStorage.removeItem('edu_user');
  localStorage.removeItem('edu_token');
}

// ===== FETCH WRAPPER =====
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  options.headers = headers;

  const res = await fetch(url, options);
  if (res.status === 401 || res.status === 403) {
    alert("Session expired or unauthorized. Please log in again.");
    clearLoginState();
    window.location = 'login.html';
    return;
  }
  return res;
}

// ===== UI ROLE VISIBILITY =====
function applyRoleVisibility() {
  const user = getCurrentUser();
  const isTeacher = user && user.role === 'teacher';

  // Hide/show elements by class
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isTeacher ? '' : 'none';
  });

  // Update nav/login button state
  const navLogin = document.querySelector('.nav-login');
  if (navLogin) {
    if (user) {
      navLogin.textContent = `Logout (${user.name || user.email})`;
      navLogin.href = '#';
      navLogin.addEventListener('click', (e) => {
        e.preventDefault();
        clearLoginState();
        window.location = 'login.html';
      });
    } else {
      navLogin.textContent = 'Login';
      navLogin.href = 'login.html';
    }
  }
}

// ===== ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  applyRoleVisibility();
});
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navLogin = document.querySelector(".nav-login");
  
  if (user) {
    navLogin.textContent = `Logged in as ${user.role}`;
    navLogin.href = "#";
  }
});
