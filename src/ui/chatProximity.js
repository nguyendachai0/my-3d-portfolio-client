// ui/chatProximity.js
export function updateChatProximity(camera, robot) {
  const chatBox = document.getElementById('chat-box');
  const distanceToRobot = camera.position.distanceTo(robot.position);

  const inProximity = distanceToRobot < 4;
  chatBox.style.display = inProximity ? 'flex' : 'none';

  return inProximity;
}
