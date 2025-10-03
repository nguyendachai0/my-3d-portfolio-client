import * as THREE from 'three';
import { initScene } from './sceneSetup.js';
import { initLights } from './world/initLights.js';
import { initEnvironment } from './world/initEnvironment.js';
import { setupControls } from './controls/setupControls.js';
import { initStars } from './world/initStars.js';
import { initPortfolio } from './world/initPortfolio.js';
import { updateTimeOfDay } from './world/updateTimeOfDay.js';
import { updateProjectPanel } from './ui/projectPanel.js';
import { setupMultiplayer, sendPlayerUpdate, remotePlayers } from './network/socket.js';
import { createPlayerModel } from './objects/remotePlayer.js';

const { scene, camera, renderer } = initScene();
const textureLoader = new THREE.TextureLoader();
const lights = initLights(scene, textureLoader);
const {
  sun, sunGlow, sunSphere,
  moonLight, moonGlow, moonSphere,
  ambient
} = lights;

const {
  pathMesh, curve, water, fallbackGround
} = initEnvironment(scene, textureLoader, sun);

setupMultiplayer(scene, createPlayerModel);

const {
  controls,
  update: updateControls
} = setupControls(camera, renderer.domElement, curve, pathMesh, fallbackGround);

const { updateStars, starsMaterial } = initStars(scene);

const interactionDistance = 4;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const interactiveSpheres = initPortfolio(scene, curve);
const clock = new THREE.Clock();
const cycleDuration = 60;
const skyDayColor = new THREE.Color(0x87ceeb);
const skyNightColor = new THREE.Color(0x0a0a2a);
const fogDayColor = new THREE.Color(0x87ceeb);
const fogNightColor = new THREE.Color(0x0a0a2a);

// ✅ Safe action runner


function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  
    updateControls(delta);
  

  for (const player of Object.values(remotePlayers)) {
  if (player?.mesh) {
    const playerPos = player.mesh.position.clone();
    const camPos = camera.position.clone();
    camPos.y = playerPos.y;

    const direction = new THREE.Vector3().subVectors(camPos, playerPos).normalize();
    const targetQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );

    player.mesh.quaternion.slerp(targetQuat, 0.1); // smooth turn
  }
}


  water.material.uniforms['time'].value += delta;

  const elapsedTime = clock.getElapsedTime();

  const { isDay } = updateTimeOfDay({
    elapsedTime,
    cycleDuration,
    sun,
    sunSphere,
    sunGlow,
    moonLight,
    moonSphere,
    moonGlow,
    ambient,
    scene,
    fogDayColor,
    fogNightColor,
    skyDayColor,
    skyNightColor,
    starsMaterial
  });

  updateStars(delta, isDay, elapsedTime);

  // Environment transitions
  const skyColor = isDay ? skyDayColor : skyNightColor;
  const fogColor = isDay ? fogDayColor : fogNightColor;
  const ambientIntensity = isDay ? 1.0 : 0.3;
  const starOpacity = isDay ? 0 : 0.8;

  scene.background.lerp(skyColor, 0.05);
  scene.fog.color.lerp(fogColor, 0.05);
  ambient.intensity += (ambientIntensity - ambient.intensity) * 0.05;
  starsMaterial.opacity += (starOpacity - starsMaterial.opacity) * 0.05;

  updateProjectPanel(camera, interactiveSpheres, interactionDistance);
  renderer.render(scene, camera);

  sendPlayerUpdate(
  {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  },
  {
    y: camera.rotation.y
  }
);
}

animate();

export { scene };


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
