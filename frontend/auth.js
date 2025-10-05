document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("edu_user"));
  const adminElements = document.querySelectorAll(".admin-only");
  const parentElements = document.querySelectorAll(".parent-only");
  const studentElements = document.querySelectorAll(".student-only");

  if (user) {
    document.body.classList.add(`role-${user.role}`);
  } else {
    document.body.classList.add("role-guest");
  }

  adminElements.forEach(el => {
    el.style.display = user?.role === "admin" ? "" : "none";
  });
  parentElements.forEach(el => {
    el.style.display = user?.role === "parent" ? "" : "none";
  });
  studentElements.forEach(el => {
    el.style.display = user?.role === "student" ? "" : "none";
  });
});
