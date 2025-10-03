// utils/deviceCheck.js
export const isMobile = (
  'ontouchstart' in window || navigator.maxTouchPoints > 0
) && typeof screen.orientation !== "undefined";

console.log(isMobile ? "Mobile" : "Desktop");