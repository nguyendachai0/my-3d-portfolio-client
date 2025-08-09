// world/updateTimeOfDay.js
import * as THREE from 'three';

export function updateTimeOfDay({
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
}) {
  const cycleProgress = (elapsedTime % cycleDuration) / cycleDuration;
  const angle = cycleProgress * Math.PI * 2;

  const isDay = Math.cos(angle) > 0;

  // Sun
  const sunX = Math.sin(angle) * 30;
  const sunY = Math.cos(angle) * 30;
  sun.position.set(sunX, sunY, 10);
  sunSphere.position.copy(sun.position);
  sunGlow.position.copy(sun.position);

  // Moon
  const moonX = -Math.sin(angle) * 30;
  const moonY = -Math.cos(angle) * 30;
  moonLight.position.set(moonX, moonY, -10);
  moonSphere.position.copy(moonLight.position);
  moonGlow.position.copy(moonLight.position);

  // Intensities
  sunGlow.intensity = isDay ? 1.5 : 0;
  moonGlow.intensity = isDay ? 0 : 0.4;

  // Lerp fog and background
  const targetSky = isDay ? skyDayColor : skyNightColor;
  const targetFog = isDay ? fogDayColor : fogNightColor;
  const ambientTarget = isDay ? 1.0 : 0.3;
  const starOpacity = isDay ? 0 : 0.8;

  scene.background.lerp(targetSky, 0.05);
  scene.fog.color.lerp(targetFog, 0.05);
  ambient.intensity += (ambientTarget - ambient.intensity) * 0.05;
  starsMaterial.opacity += (starOpacity - starsMaterial.opacity) * 0.05;

  return { isDay }; // useful for updateStars
}
