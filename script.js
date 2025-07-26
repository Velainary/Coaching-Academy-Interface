function toggleDropdown() {
  const dropdown = document.getElementById('menuDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Auto-close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('menuDropdown');
  const menuButton = document.querySelector('.menu-button');
  if (!dropdown.contains(event.target) && !menuButton.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});

// Drag-to-scroll for student/tutor cards
const studentScroll = document.getElementById('students-scroll');
const tutorScroll = document.getElementById('tutors-scroll');

[studentScroll, tutorScroll].forEach(container => {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', e => {
    isDown = true;
    container.classList.add('active');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('active');
  });
  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('active');
  });
  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
});
