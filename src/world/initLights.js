import * as THREE from 'three';

export function initLights(scene, textureLoader) {
  // Ambient Light
  const ambient = new THREE.AmbientLight(0xcccccc, 1.0);
  scene.add(ambient);

  // Sun (DirectionalLight + mesh + glow)
  const sun = new THREE.DirectionalLight(0xffffff, 4.0);
  sun.position.set(10, 20, 10);
  sun.userData.label="sun";
  scene.add(sun);

  const sunTexture = textureLoader.load('assets/textures/sun.jpg');
  const sunSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({
      map: sunTexture,
      emissive: 0xffcc33,
      emissiveIntensity: 1,
      roughness: 0.5
    })
  );
  scene.add(sunSphere);

  const sunGlow = new THREE.PointLight(0xffaa33, 1.5, 100, 2);
  scene.add(sunGlow);

  // Moon (DirectionalLight + mesh + glow)
  const moonLight = new THREE.DirectionalLight(0x9999ff, 0.5);
  moonLight.position.set(-10, -20, -10);
  
  scene.add(moonLight);

  const moonTexture = textureLoader.load('assets/textures/moon.jpg');
  const moonSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
      emissive: 0x8888ff,
      emissiveIntensity: 0.4,
      roughness: 1,
      metalness: 0.1
    })
  );
  scene.add(moonSphere);

  const moonGlow = new THREE.PointLight(0x8888ff, 0.4, 50, 2);
  scene.add(moonGlow);

  return {
    sun,
    sunGlow,
    sunSphere,
    moonLight,
    moonGlow,
    moonSphere,
    ambient
  };
}
