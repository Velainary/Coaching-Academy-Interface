// frontend/app.js
// Keep this small — useful helpers for pages

// Show user in nav if logged in
(function showUserInNav(){
  const user = JSON.parse(localStorage.getItem('edu_user') || 'null');
  const navLogin = document.getElementById('nav-login');
  if(navLogin){
    if(user){
      navLogin.innerText = user.name;
      navLogin.href = '#';
      navLogin.addEventListener('click', (e)=>{
        e.preventDefault();
        if(confirm('Logout?')) {
          localStorage.removeItem('edu_user');
          window.location = 'index.html';
        }
      });
    }
  }
})();
