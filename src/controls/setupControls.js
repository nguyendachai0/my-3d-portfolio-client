import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export function setupControls(camera, rendererDomElement, curve, pathMesh, fallbackGround) {
  const controls = new PointerLockControls(camera, rendererDomElement);

  const keys = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
  };

  const playerHeight = 1.8;
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const startPoint = curve.getPointAt(0);

  // Initial camera position
  camera.position.set(startPoint.x, playerHeight + 0.5, startPoint.z);
  raycaster.set(camera.position.clone(), new THREE.Vector3(0, -1, 0));
  const initialHits = raycaster.intersectObjects([pathMesh, fallbackGround], true);
  if (initialHits.length > 0) {
    camera.position.y = initialHits[0].point.y + playerHeight;
  }

  // Key events
  document.addEventListener('keydown', (e) => keys[e.code] = true);
  document.addEventListener('keyup', (e) => keys[e.code] = false);

  // ✅ Only allow click on info-overlay to trigger pointer lock and audio
  const infoOverlay = document.getElementById('info-overlay');
  if (infoOverlay) {
    infoOverlay.addEventListener('click', () => {
      try {
        controls.lock();
      } catch (err) {
        console.warn('PointerLock error:', err);
      }

      // Play background music and water sound safely
      const bgMusic = document.getElementById('bg-music');
      const waterSound = document.getElementById('water-sound');
      if (bgMusic && waterSound) {
        bgMusic.volume = 0.4;
        waterSound.volume = 0.3;

        bgMusic.play().catch(e => console.warn('BG Music blocked:', e));
        waterSound.play().catch(e => console.warn('Water sound blocked:', e));
      }
    });
  }

  // UI behavior when locked
  controls.addEventListener('lock', () => {
    const overlay = document.getElementById('info-overlay');
    const hud = document.getElementById('crosshair-hud');
    if (overlay) overlay.classList.add('hidden');
    if (hud) hud.style.display = 'block';
  });

  // UI behavior when unlocked
  controls.addEventListener('unlock', () => {
    const overlay = document.getElementById('info-overlay');
    const hud = document.getElementById('crosshair-hud');
    if (overlay) overlay.classList.remove('hidden');
    if (hud) hud.style.display = 'none';
  });

  function update(delta) {
    if (!controls.isLocked) return;

    raycaster.set(camera.position.clone(), new THREE.Vector3(0, -1, 0));
    const intersections = raycaster.intersectObjects([pathMesh, fallbackGround], true);
    const onGround = intersections.length > 0 && intersections[0].distance <= playerHeight + 0.2;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 30.0 * delta; // gravity

    direction.z = Number(keys['KeyW']) - Number(keys['KeyS']);
    direction.x = Number(keys['KeyD']) - Number(keys['KeyA']);

    if (direction.length() > 0) {
      direction.normalize();
      if (keys['KeyW'] || keys['KeyS']) velocity.z += direction.z * 100.0 * delta;
      if (keys['KeyA'] || keys['KeyD']) velocity.x += direction.x * 100.0 * delta;
    }

    controls.moveRight(velocity.x * delta);
    controls.moveForward(velocity.z * delta);
    camera.position.y += velocity.y * delta;

    if (onGround) {
      velocity.y = 0;
      camera.position.y = intersections[0].point.y + playerHeight;
    }

    // Fall reset
    if (camera.position.y < -20) {
      velocity.set(0, 0, 0);
      camera.position.set(startPoint.x, playerHeight + 0.5, startPoint.z);
    }
  }

  return {
    controls,
    update
  };
}
