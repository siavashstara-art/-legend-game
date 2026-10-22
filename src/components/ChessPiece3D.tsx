import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Color, PieceType } from '../types/chess.ts';

interface ChessPiece3DProps {
  type: PieceType;
  color: Color;
  isSelected?: boolean;
  enableMetallurgy?: boolean;
}

// 6 Alchemical Sacred Metallurgy Materials with high-precision PBR properties
const ALCHEMY_PALETTE: Record<
  PieceType,
  {
    whiteBase: string;
    whiteSpecular: string;
    blackBase: string;
    blackSpecular: string;
    metalness: number;
    roughness: number;
    clearcoat: number;
  }
> = {
  // 1. شاه: طلای خالص ۲۴ عیار سلطنتی (24K Pure Imperial Sovereign Gold)
  k: {
    whiteBase: '#f59e0b',
    whiteSpecular: '#fef08a',
    blackBase: '#854d0e',
    blackSpecular: '#a16207',
    metalness: 0.98,
    roughness: 0.12,
    clearcoat: 0.98
  },
  // 2. ملکه و وزیر: طلای زرین با تاج و نگین‌های نقره‌ای خالص (Queen Royal Gold & Silver Vizier)
  q: {
    whiteBase: '#fbbf24',
    whiteSpecular: '#ffffff',
    blackBase: '#713f12',
    blackSpecular: '#64748b',
    metalness: 0.96,
    roughness: 0.14,
    clearcoat: 0.96
  },
  // 3. فیل: برنز کهن اساطیری هلنی و پارسی (Ancient Mythic Bronze)
  b: {
    whiteBase: '#d97706',
    whiteSpecular: '#fbbf24',
    blackBase: '#78350f',
    blackSpecular: '#92400e',
    metalness: 0.88,
    roughness: 0.22,
    clearcoat: 0.85
  },
  // 4. اسب: چوب نفیس خراطی‌شده ساج، آبنوس و گردو (Hand-carved Sacred Artisan Wood)
  n: {
    whiteBase: '#854d0e',
    whiteSpecular: '#a16207',
    blackBase: '#2e1810',
    blackSpecular: '#451a03',
    metalness: 0.04,
    roughness: 0.80,
    clearcoat: 0.20
  },
  // 5. رخ: آلومینیوم صیقلی دژ و هوافضا (Brushed Citadel Aerospace Aluminum)
  r: {
    whiteBase: '#cbd5e1',
    whiteSpecular: '#f1f5f9',
    blackBase: '#1e293b',
    blackSpecular: '#475569',
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 0.90
  },
  // 6. سربازان: آهن گداخته و فولاد دمشقی (Forged Damascus Meteoric Iron)
  p: {
    whiteBase: '#475569',
    whiteSpecular: '#64748b',
    blackBase: '#0f172a',
    blackSpecular: '#1e293b',
    metalness: 0.78,
    roughness: 0.36,
    clearcoat: 0.60
  }
};

export const ChessPiece3D: React.FC<ChessPiece3DProps> = ({
  type,
  color,
  isSelected = false,
  enableMetallurgy = true
}) => {
  const isWhite = color === 'w';

  // Primary Material computation
  const primaryMaterial = useMemo(() => {
    const config = ALCHEMY_PALETTE[type];
    const baseColor = isWhite ? config.whiteBase : config.blackBase;
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: config.clearcoat,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });
  }, [type, isWhite]);

  // Accent & Trim Material computation
  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isWhite ? '#fbbf24' : '#f43f5e',
      metalness: 0.9,
      roughness: 0.2,
      emissive: isWhite ? '#b45309' : '#881337',
      emissiveIntensity: isSelected ? 0.6 : 0.25
    });
  }, [isWhite, isSelected]);

  // Pure Sterling Silver Material for Vizier accents on Queen
  const silverVizierMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: isWhite ? '#f8fafc' : '#64748b',
      metalness: 0.98,
      roughness: 0.10,
      clearcoat: 0.98,
      clearcoatRoughness: 0.08
    });
  }, [isWhite]);

  // Base plinth material
  const plinthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isWhite ? '#1e293b' : '#090d16',
      metalness: 0.5,
      roughness: 0.35
    });
  }, [isWhite]);

  // Aura material for selection
  const auraMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#f59e0b',
      transparent: true,
      opacity: 0.55
    });
  }, []);

  return (
    <group position={[0, isSelected ? 0.12 : 0, 0]}>
      {/* Selection Halo Effect */}
      {isSelected && (
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.05, 32]} />
          <primitive object={auraMaterial} />
        </mesh>
      )}

      {/* Sub-Pedestal Chamfer (Weight Base) */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.08, 32]} />
        <primitive object={plinthMaterial} />
      </mesh>

      {/* Luminous Team Accent Torus Ring */}
      <mesh position={[0, 0.085, 0]}>
        <torusGeometry args={[0.36, 0.025, 16, 32]} />
        <primitive object={trimMaterial} />
      </mesh>

      {/* Main Beveled Lower Base */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.31, 0.36, 0.08, 32]} />
        <primitive object={primaryMaterial} />
      </mesh>

      {/* Waist Ring */}
      <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.30, 0.06, 32]} />
        <primitive object={primaryMaterial} />
      </mesh>

      {/* ===================== PAWN ===================== */}
      {type === 'p' && (
        <group position={[0, 0.23, 0]}>
          {/* Stem Column */}
          <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.13, 0.23, 0.32, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Neck Collar */}
          <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.19, 0.14, 0.06, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <torusGeometry args={[0.17, 0.02, 12, 24]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Spherical Head */}
          <mesh position={[0, 0.50, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.16, 28, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Top Pip */}
          <mesh position={[0, 0.67, 0]} castShadow>
            <sphereGeometry args={[0.03, 12, 12]} />
            <primitive object={trimMaterial} />
          </mesh>
        </group>
      )}

      {/* ===================== ROOK ===================== */}
      {type === 'r' && (
        <group position={[0, 0.23, 0]}>
          {/* Fortress Column */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.27, 0.48, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Cornice Flare */}
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.28, 0.23, 0.10, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          <mesh position={[0, 0.57, 0]}>
            <torusGeometry args={[0.26, 0.02, 12, 24]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Parapet Crenellations (4 distinct battlements) */}
          <group position={[0, 0.64, 0]}>
            {/* Merlon 1 (Front) */}
            <mesh position={[0, 0, 0.20]} castShadow receiveShadow>
              <boxGeometry args={[0.14, 0.12, 0.07]} />
              <primitive object={primaryMaterial} />
            </mesh>
            {/* Merlon 2 (Back) */}
            <mesh position={[0, 0, -0.20]} castShadow receiveShadow>
              <boxGeometry args={[0.14, 0.12, 0.07]} />
              <primitive object={primaryMaterial} />
            </mesh>
            {/* Merlon 3 (Left) */}
            <mesh position={[-0.20, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.07, 0.12, 0.14]} />
              <primitive object={primaryMaterial} />
            </mesh>
            {/* Merlon 4 (Right) */}
            <mesh position={[0.20, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.07, 0.12, 0.14]} />
              <primitive object={primaryMaterial} />
            </mesh>
            {/* Inner Hollow Center */}
            <mesh position={[0, -0.02, 0]} receiveShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
              <primitive object={plinthMaterial} />
            </mesh>
          </group>
        </group>
      )}

      {/* ===================== KNIGHT ===================== */}
      {type === 'n' && (
        <group position={[0, 0.23, 0]} rotation={[0, isWhite ? 0 : Math.PI, 0]}>
          {/* Steed Pedestal Core */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.20, 0.26, 0.34, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Arched Muscular Neck */}
          <mesh position={[0, 0.40, 0.04]} rotation={[0.42, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.36, 0.28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Knight Mane Crest */}
          <mesh position={[0, 0.48, -0.10]} rotation={[0.22, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.36, 0.16]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Snout and Jaw */}
          <mesh position={[0, 0.54, 0.18]} rotation={[-0.32, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.20, 0.22, 0.26]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Nostrils/Muzzle Tip */}
          <mesh position={[0, 0.48, 0.30]} castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.12, 0.10]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Left Ear */}
          <mesh position={[-0.08, 0.68, 0.02]} rotation={[-0.2, 0, -0.2]} castShadow>
            <coneGeometry args={[0.04, 0.12, 8]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Right Ear */}
          <mesh position={[0.08, 0.68, 0.02]} rotation={[-0.2, 0, 0.2]} castShadow>
            <coneGeometry args={[0.04, 0.12, 8]} />
            <primitive object={trimMaterial} />
          </mesh>
        </group>
      )}

      {/* ===================== BISHOP ===================== */}
      {type === 'b' && (
        <group position={[0, 0.23, 0]}>
          {/* Slender Column */}
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.25, 0.50, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Miter Shoulder Ring */}
          <mesh position={[0, 0.53, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.21, 0.16, 0.08, 24]} />
            <primitive object={primaryMaterial} />
          </mesh>
          <mesh position={[0, 0.57, 0]}>
            <torusGeometry args={[0.19, 0.02, 12, 24]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Miter Oval Head */}
          <mesh position={[0, 0.72, 0]} scale={[1, 1.35, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.19, 28, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Slanted Carved Cleft */}
          <mesh position={[0.08, 0.82, 0.08]} rotation={[0.4, 0, 0.4]}>
            <boxGeometry args={[0.03, 0.24, 0.14]} />
            <primitive object={plinthMaterial} />
          </mesh>
          {/* Top Cross Finial Ball */}
          <mesh position={[0, 0.99, 0]} castShadow>
            <sphereGeometry args={[0.065, 16, 16]} />
            <primitive object={trimMaterial} />
          </mesh>
        </group>
      )}

      {/* ===================== QUEEN ===================== */}
      {type === 'q' && (
        <group position={[0, 0.23, 0]}>
          {/* Flared Gown Column */}
          <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.26, 0.62, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Coronet Plinth Collar */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.17, 0.10, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          <mesh position={[0, 0.70, 0]}>
            <torusGeometry args={[0.25, 0.025, 16, 28]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Flared Royal Coronet */}
          <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.29, 0.22, 0.16, 16]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Coronet Crown Points (12 Radiating Petals) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const r = 0.28;
            return (
              <mesh
                key={`q-point-${i}`}
                position={[Math.cos(angle) * r, 0.88, Math.sin(angle) * r]}
                castShadow
              >
                <sphereGeometry args={[0.04, 16, 16]} />
                <primitive object={silverVizierMaterial} />
              </mesh>
            );
          })}
          {/* Celestial Radiant Silver Vizier Finial */}
          <mesh position={[0, 0.96, 0]} castShadow>
            <sphereGeometry args={[0.09, 24, 24]} />
            <primitive object={silverVizierMaterial} />
          </mesh>
        </group>
      )}

      {/* ===================== KING ===================== */}
      {type === 'k' && (
        <group position={[0, 0.23, 0]}>
          {/* Royal Sovereign Column */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.19, 0.28, 0.68, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Imperial Shoulder Flare */}
          <mesh position={[0, 0.71, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.28, 0.20, 0.12, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          <mesh position={[0, 0.77, 0]}>
            <torusGeometry args={[0.27, 0.03, 16, 28]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Imperial Crown Dome */}
          <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.24, 28, 28]} />
            <primitive object={primaryMaterial} />
          </mesh>
          {/* Crown Arch Ribs */}
          <mesh position={[0, 0.90, 0]}>
            <torusGeometry args={[0.23, 0.02, 12, 28]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Royal Finial Mount */}
          <mesh position={[0, 1.10, 0]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <primitive object={trimMaterial} />
          </mesh>
          {/* Imperial Royal Cross (Vertical Beam + Horizontal Crossbar) */}
          <group position={[0, 1.22, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.065, 0.24, 0.065]} />
              <primitive object={trimMaterial} />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.20, 0.065, 0.065]} />
              <primitive object={trimMaterial} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
