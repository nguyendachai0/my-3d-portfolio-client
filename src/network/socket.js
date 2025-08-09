import { io } from 'socket.io-client';

const socket = io('https://portfolio-server-c07i.onrender.com');
export const remotePlayers = {};

export function setupMultiplayer(scene, createPlayerModel) {
  socket.on('connect', () => {
    console.log('[Socket.IO] Connected with ID:', socket.id);
  });

  socket.on('playerJoined', async ({ id, position, rotation, modelName }) => {
    if (id === socket.id) return;
    console.log('[Player Joined]', id, 'with model', modelName);

    try {
      
      const player = await createPlayerModel(id, position, rotation, modelName);
      remotePlayers[id] = player;
      scene.add(player.mesh); // ✅ Now it's ready!
    } catch (err) {
      console.error('[Failed to load player model]', err);
    }
  });

  socket.on('playerMoved', ({ id, position, rotation }) => {
    const player = remotePlayers[id];
    if (player) {
      player.update(position, rotation);
    }
  });

  socket.on('playerLeft', id => {
    const player = remotePlayers[id];
    if (player) {
      scene.remove(player.mesh);
      delete remotePlayers[id];
    }
  });
}

export function sendPlayerUpdate(position, rotation) {
  socket.emit('playerUpdate', { position, rotation });
}
