import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

export function initEnvironment(scene, textureLoader, sun) {
  // ===== Path setup =====
  const pathPoints = [
    new THREE.Vector3(0, 0, 50),
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(20, 0, -10),
    new THREE.Vector3(-10, 0, -30),
    new THREE.Vector3(-30, 0, -50),
    new THREE.Vector3(-10, 0, -70),
    new THREE.Vector3(20, 0, -90)
  ];
  const curve = new THREE.CatmullRomCurve3(pathPoints);

  const tileColorMap = textureLoader.load('assets/textures/Tiles107_2K-JPG_Color.jpg');
  tileColorMap.wrapS = tileColorMap.wrapT = THREE.RepeatWrapping;
  tileColorMap.repeat.set(120, 3);

  const pathMaterial = new THREE.MeshStandardMaterial({
    map: tileColorMap,
    roughness: 0.5
  });

  const pathGeometry = new THREE.TubeGeometry(curve, 200, 2, 12, false);
  const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
  pathMesh.userData.label = 'Stone path';
  pathMesh.name = 'Stone path';
  scene.add(pathMesh);

  // ===== Water setup =====
  const waterGeometry = new THREE.PlaneGeometry(500, 500);

  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: textureLoader.load('assets/textures/WaterNormal.png', (t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: sun.position.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x00bfff,
    distortionScale: 3.0,
    fog: true,
    transparent: true,
    opacity: 0.7
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = 1;

  water.name = 'shimmering water';
  water.userData.label = 'Water surface';

  // Bottom water layer (fake thickness)
  const waterBottom = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({
      color: 0x004466,
      transparent: true,
      opacity: 0.5
    })
  );
  waterBottom.rotation.x = -Math.PI / 2;
  waterBottom.position.y = 0.5;
  waterBottom.name = 'water bottom';
  waterBottom.userData.label = 'Water depth';

  // Group water top and bottom
  const waterGroup = new THREE.Group();
  waterGroup.name = 'Water Volume';
  waterGroup.userData.label = 'Water surface';
  waterGroup.add(water);
  waterGroup.add(waterBottom);
  scene.add(waterGroup);

  // ===== Invisible fallback ground =====
  const fallbackGround = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ visible: false })
  );
  fallbackGround.rotation.x = -Math.PI / 2;
  fallbackGround.position.y = -1;
  fallbackGround.userData.label = 'ground';
  fallbackGround.name = 'Invisible Ground';
  scene.add(fallbackGround);

  return {
    pathMesh,
    curve,
    water, // still return water object for uniforms like `water.material.uniforms['time'].value`
    fallbackGround
  };
}
