import * as THREE from 'three';
import { robotInstance } from '../main.js';

// Action set the robot can perform
export const robotActions = {
  moveForward: () => robotInstance.moveForward(),
  turnLeft: () => robotInstance.turnLeft(),
  turnRight: () => robotInstance.turnRight(),
  interactWithLabel: (label) => robotInstance.interactWithLabel(label),
  pickUpNearestObject: () => console.log("[Action] Picking up nearest object"),
  speak: (msg) => console.log(`[Robot says] ${msg}`)
};

function isDescendant(child, parent) {
  while (child) {
    if (child === parent) return true;
    child = child.parent;
  }
  return false;
}

function getObjectLabel(object) {
  let hit = object;
  while (hit) {
    const dataLabel = hit.userData?.label;
    const dataName = hit.userData?.name;
    const dataTitle = hit.userData?.title;
    const nameLabel = hit.name && hit.name.trim() ? hit.name : null;
    if (dataLabel) return dataLabel;
    if (dataName) return dataName;
    if (dataTitle) return dataTitle;
    if (nameLabel) return nameLabel;
    hit = hit.parent;
  }
  if (object.geometry?.type) {
    return object.geometry.type.replace('Geometry', '').toLowerCase();
  }
  if (object.type && object.type !== 'Mesh') return object.type;
  return 'unknown object';
}

export function findObjectByLabel(scene, label) {
  if (!scene) {
    console.warn('[findObjectByLabel] No scene provided.');
    return null;
  }

  let found = null;
  scene.traverse((child) => {
    const dataLabel = child.userData?.label;
    const dataName = child.userData?.name;
    const dataTitle = child.userData?.title;
    const nameLabel = child.name && child.name.trim() ? child.name : null;

    const possibleLabels = [dataLabel, dataName, dataTitle, nameLabel];
    
    if (possibleLabels.includes(label)) {
      found = child;
    }
  });

  return found;
}


export function moveToLabel(robot, scene, label) {
  if (!robot) return;

  const object = findObjectByLabel(scene, label);
  if (!object) {
    console.warn(`[moveToLabel] Could not find object with label: ${label}`);
    return;
  }

  const targetPos = new THREE.Vector3().copy(object.position);
  const robotPos = new THREE.Vector3().copy(robot.position);
  const direction = new THREE.Vector3().subVectors(targetPos, robotPos).normalize();

  robot.lookAt(targetPos);

  const speed = 0.03;
  const interval = setInterval(() => {
    const distance = robot.position.distanceTo(targetPos);

    if (distance < 2) {
      clearInterval(interval);
      console.log(`[moveToLabel] Arrived near '${label}'`);
      // triggerInteraction(object);
    } else {
      robot.position.addScaledVector(direction, speed);
    }
  }, 16);
}

// SCAN all visible objects in camera view (like human peripheral vision)
export function describeScene(eyeCamera, scene, excludeObject = null, limit = 10) {
  if (!eyeCamera || !eyeCamera.isCamera) return [];

  eyeCamera.updateMatrixWorld(true);
  const eyePos = eyeCamera.getWorldPosition(new THREE.Vector3());

  const allMeshes = [];
  scene.traverse(obj => {
    if (obj.isMesh && obj.visible && (!excludeObject || !isDescendant(obj, excludeObject))) {
      allMeshes.push(obj);
    }
  });

  const downRay = new THREE.Raycaster(eyePos, new THREE.Vector3(0, -1, 0));
  const groundHits = downRay.intersectObjects(allMeshes, false);
  const groundObj = groundHits[0]?.object;

  const visibleList = [];
  for (const mesh of allMeshes) {
    if (groundObj && isDescendant(mesh, groundObj)) continue;
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
    const center = mesh.geometry.boundingSphere.center.clone().applyMatrix4(mesh.matrixWorld);
    const projected = center.clone().project(eyeCamera);

    if (
      projected.x >= -1 && projected.x <= 1 &&
      projected.y >= -1 && projected.y <= 1 &&
      projected.z >= 0 && projected.z <= 1
    ) {
      visibleList.push({
        label: getObjectLabel(mesh),
        position: center.toArray(),
        distance: eyePos.distanceTo(center),
        mesh
      });
    }
  }

  visibleList.sort((a, b) => a.distance - b.distance);
  return visibleList.slice(0, limit);
}


