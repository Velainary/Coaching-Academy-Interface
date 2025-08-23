// Drag-to-scroll for student/tutor cards
const scrollContainers = [
  document.getElementById('students-scroll'),
  document.getElementById('tutors-scroll')
];

scrollContainers.forEach(container => {
  if (!container) return; // prevent errors if element is missing

  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => { isDown = false; });
  container.addEventListener('mouseup', () => { isDown = false; });

  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    container.scrollLeft = scrollLeft - walk;
  });
});
