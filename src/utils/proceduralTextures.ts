import * as THREE from 'three';

// Procedural texture cache to prevent recreating textures on re-renders
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Generates an ultra-realistic procedural wood texture with natural grain,
 * growth rings, and warm lacquer satin polish.
 */
export function getProceduralWoodTexture(type: 'dark_walnut' | 'light_maple' | 'border_rosewood'): THREE.CanvasTexture {
  if (textureCache.has(type)) {
    return textureCache.get(type)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    textureCache.set(type, fallback);
    return fallback;
  }

  // Base background gradient
  let baseColor1 = '#5c3818';
  let baseColor2 = '#3a200b';
  let grainColor = 'rgba(25, 12, 4, 0.12)';

  if (type === 'light_maple') {
    baseColor1 = '#ebd5b3';
    baseColor2 = '#dfc399';
    grainColor = 'rgba(140, 100, 60, 0.08)';
  } else if (type === 'border_rosewood') {
    baseColor1 = '#2c1409';
    baseColor2 = '#1a0a04';
    grainColor = 'rgba(10, 4, 2, 0.22)';
  }

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, baseColor1);
  grad.addColorStop(1, baseColor2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Draw natural organic wood grain lines
  ctx.strokeStyle = grainColor;
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 180; i++) {
    ctx.beginPath();
    const startY = (i * 512) / 120 + (Math.sin(i * 0.2) * 15);
    ctx.moveTo(0, startY);

    for (let x = 0; x <= 512; x += 16) {
      const wave = Math.sin(x * 0.02 + i * 0.15) * 6 + Math.cos(x * 0.008) * 4;
      ctx.lineTo(x, startY + wave);
    }
    ctx.stroke();
  }

  // Subtle wood knots
  ctx.fillStyle = grainColor;
  for (let k = 0; k < 3; k++) {
    const kx = 100 + k * 140 + Math.random() * 40;
    const ky = 120 + k * 110 + Math.random() * 30;
    ctx.beginPath();
    ctx.ellipse(kx, ky, 25, 8, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(type, texture);
  return texture;
}

/**
 * Generates an ultra-realistic procedural Carrara & Nero Marquina marble texture
 */
export function getProceduralMarbleTexture(type: 'white_carrara' | 'black_marquina'): THREE.CanvasTexture {
  if (textureCache.has(type)) {
    return textureCache.get(type)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    textureCache.set(type, fallback);
    return fallback;
  }

  const isWhite = type === 'white_carrara';
  ctx.fillStyle = isWhite ? '#f8fafc' : '#111827';
  ctx.fillRect(0, 0, 512, 512);

  // Marble veining
  ctx.strokeStyle = isWhite ? 'rgba(100, 116, 139, 0.18)' : 'rgba(241, 245, 249, 0.15)';
  ctx.lineWidth = 1.2;

  for (let v = 0; v < 12; v++) {
    ctx.beginPath();
    let cx = Math.random() * 512;
    let cy = 0;
    ctx.moveTo(cx, cy);

    while (cy < 512) {
      cx += (Math.random() - 0.48) * 25;
      cy += Math.random() * 20 + 10;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(type, texture);
  return texture;
}
