document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/api/courses")
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector(".course-list");
      container.innerHTML = "";
      data.forEach(course => {
        container.innerHTML += `
          <div class="course">
            <h3>${course.subject}</h3>
            <p>Schedule: ${course.schedule}</p>
          </div>
        `;
      });
    })
    .catch(err => console.error(err));
});
