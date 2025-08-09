// world/initStars.js
import * as THREE from 'three';

export function initStars(scene) {
  const starCount = 1500;
  const starVertices = [];
  const starColors = [];

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = Math.random() * 300 + 100;
    const z = (Math.random() - 0.5) * 800;
    starVertices.push(x, y, z);

    const brightness = Math.random() * 0.8 + 0.2;
    starColors.push(brightness, brightness, brightness);
  }

  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

  const starsMaterial = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Setup for shooting stars
  const trailPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0.2),
    new THREE.Vector3(2, 0, 0.4)
  ];
  const shootingStarGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
  const shootingStarMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });

  const shootingStars = [];

  function spawnShootingStar() {
    const star = new THREE.Line(shootingStarGeometry, shootingStarMaterial.clone());
    star.position.set(
      (Math.random() - 0.5) * 200,
      Math.random() * 100 + 100,
      (Math.random() - 0.5) * 200
    );
    star.material.opacity = 1;
    scene.add(star);
    shootingStars.push({ mesh: star, speed: Math.random() * 0.5 + 0.5 });
  }

  function updateStars(delta, isDay, elapsedTime) {
    if (!isDay) {
      for (let i = 0; i < starColors.length; i += 3) {
        const flicker = 0.8 + Math.sin(elapsedTime * 5 + i) * 0.2;
        starsMaterial.opacity = flicker * 0.8;
      }
    } else {
      starsMaterial.opacity = 0;
    }

    if (Math.random() < 0.01 && !isDay) {
      spawnShootingStar();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      star.mesh.position.x += star.speed * 2;
      star.mesh.position.y -= star.speed;
      star.mesh.material.opacity -= 0.01;

      if (star.mesh.material.opacity <= 0) {
        scene.remove(star.mesh);
        shootingStars.splice(i, 1);
      }
    }
  }

  return { updateStars, starsMaterial };
}
