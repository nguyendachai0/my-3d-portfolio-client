import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createPlayerModel(id, position, rotation, modelName = 'Naruto') {
  const loader = new GLTFLoader();
  const modelPath = `/models/${modelName}.glb`;

  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // 🔍 Normalize position and rotation
        const posArray = Array.isArray(position) ? position : [position?.x || 0, position?.y || 0, position?.z || 0];
        const rotArray = Array.isArray(rotation) ? rotation : [rotation?.x || 0, rotation?.y || 0, rotation?.z || 0];

        model.position.set(...posArray);
        model.rotation.y = rotArray[1] || 0;
        model.scale.set(1, 1, 1);

        const player = {
          id,
          mesh: model,
          update(pos, rot) {
            const p = Array.isArray(pos) ? pos : [pos?.x || 0, pos?.y || 0, pos?.z || 0];
            const r = Array.isArray(rot) ? rot : [rot?.x || 0, rot?.y || 0, rot?.z || 0];
            this.mesh.position.set(...p);
            this.mesh.rotation.y = r[1] || 0;
          }
        };

        resolve(player);
      },
      undefined,
      (err) => {
        console.error(`[Model Load Error for ${modelName}]`, err);
        reject(err);
      }
    );
  });
}
