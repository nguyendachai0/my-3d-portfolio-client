import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadRobot(scene, path = '/models/marie_skullgirls.glb') {
  const loader = new GLTFLoader();
  let robot = null;
  let mixer = null;
  let arrowHelper = null;
  let eyeCam = null; 
  let isReady = false;

  loader.load(path, (gltf) => {
    robot = gltf.scene;

    robot.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        if (!child.name || child.name.startsWith('Object_')) {
          child.name = 'Marie Mesh';
        }
        child.userData.label = 'part of Marie';
      }
    });

    robot.scale.set(1.5, 1.5, 1.5);
    robot.position.set(0, 1.5, -100); // Static start position
    scene.add(robot);

    // 👁️ Eye camera attached to robot
    eyeCam = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
    eyeCam.lookAt(0, 1.6, 10);
    robot.add(eyeCam);

    // ➤ Red direction arrow
    const direction = new THREE.Vector3();
    robot.getWorldDirection(direction);
    const position = robot.getWorldPosition(new THREE.Vector3());
    arrowHelper = new THREE.ArrowHelper(direction, position, 5, 0xff0000);
    scene.add(arrowHelper);

    // 🕺 Play animation
    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(robot);
      const walkAction = mixer.clipAction(gltf.animations[0]);
      walkAction.play();
    }

    isReady = true;
  });

  function update(delta) {
    if (!robot) return;

    // 🔻 Removed auto-patrol logic

    if (mixer) {
      mixer.update(delta);
    }

    if (arrowHelper) {
      robot.updateMatrixWorld(true);
      const direction = new THREE.Vector3();
      robot.getWorldDirection(direction);
      arrowHelper.setDirection(direction);

      const position = robot.getWorldPosition(new THREE.Vector3());
      arrowHelper.position.copy(position).add(new THREE.Vector3(0, 1.5, 0));
    }
  }

  function getRobot() {
    return robot;
  }

  function getEyeCamera() {
    return eyeCam;
  }

  function isRobotReady() {
    return isReady && eyeCam;
  }

  let movementSpeed = 2;
  let rotationSpeed = Math.PI / 16; // 11.25 degrees

  function moveForward() {
    if (!robot) return;
    const direction = new THREE.Vector3();
    robot.getWorldDirection(direction);
    robot.position.add(direction.multiplyScalar(movementSpeed));
  }

  function turnLeft() {
    if (!robot) return;
    robot.rotation.y += rotationSpeed;
  }

  function turnRight() {
    if (!robot) return;
    robot.rotation.y -= rotationSpeed;
  }

  function interactWithLabel(label){
    console.log(`[Action] Interacting with '${label}'`);
    import('../ai/describeView.js').then(({ moveToLabel }) => {
     import('../main.js').then(({ scene }) => {
      moveToLabel(robot, scene, label);
    });
  });
  }


  return {
    update,
    getRobot,
    getEyeCamera,
    isRobotReady,
    moveForward,
    turnLeft,
    turnRight,
    interactWithLabel
  };
}

