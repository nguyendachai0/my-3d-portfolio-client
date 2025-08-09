// ui/projectPanel.js
export function updateProjectPanel(camera, spheres, interactionDistance) {
  const panel = document.getElementById('project-panel');
  const titleEl = document.getElementById('panel-title');
  const descEl = document.getElementById('panel-description');
  const tagsEl = document.getElementById('panel-tags');

  let isNear = false;

  for (const sphere of spheres) {
    sphere.rotation.y += 0.01;

    const distance = camera.position.distanceTo(sphere.position);
    if (distance < interactionDistance) {
      isNear = true;
      const data = sphere.userData;
      titleEl.textContent = data.title;
      descEl.textContent = data.description;
      tagsEl.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
      panel.classList.add('visible');
      break;
    }
  }

  if (!isNear) {
    panel.classList.remove('visible');
  }
}
