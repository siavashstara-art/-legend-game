import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Color, PieceType } from '../types/chess.ts';

interface ChessPiece3DProps {
  type: PieceType;
  color: Color;
  isSelected?: boolean;
  enableMetallurgy?: boolean;
}

// 6 Alchemical Sacred Metallurgy Materials according to imperial specifications
const ALCHEMY_PALETTE: Record<
  PieceType,
  {
    baseColor: string;
    specularColor: string;
    metalness: number;
    roughness: number;
    clearcoat: number;
    titleFa: string;
  }
> = {
  // 1. شاه: طلای خالص ۲۴ عیار سلطنتی (24K Pure Imperial Sovereign Gold)
  k: {
    baseColor: '#f59e0b', // Radiant Gold
    specularColor: '#fef08a',
    metalness: 0.98,
    roughness: 0.12,
    clearcoat: 0.98,
    titleFa: 'شاه طلایی ۲۴ عیار'
  },
  // 2. ملکه و وزیر: پیکر طلایی با تاج و وزیر نقره‌ای خالص (Queen Gold Body & Sterling Silver Vizier)
  q: {
    baseColor: '#fbbf24', // Imperial Gold
    specularColor: '#ffffff',
    metalness: 0.96,
    roughness: 0.14,
    clearcoat: 0.96,
    titleFa: 'ملکه طلایی با وزیر نقره‌ای'
  },
  // 3. فیل: برنز کهن اساطیری و صیقلی (Ancient Mythic Polished Bronze)
  b: {
    baseColor: '#d97706', // Rich Metallic Bronze
    specularColor: '#fbbf24',
    metalness: 0.88,
    roughness: 0.22,
    clearcoat: 0.85,
    titleFa: 'فیل برنز کهن'
  },
  // 4. اسب: چوب نفیس خراطی‌شده ساج و گردو (Hand-carved Sacred Artisan Hardwood)
  n: {
    baseColor: '#854d0e', // Warm Deep Wood
    specularColor: '#a16207',
    metalness: 0.04,
    roughness: 0.78,
    clearcoat: 0.25,
    titleFa: 'اسب چوبی خراطی‌شده'
  },
  // 5. رخ: آلومینیوم صیقلی دژ و هوافضا (Brushed Bright Aerospace Aluminum)
  r: {
    baseColor: '#e2e8f0', // Bright Metallic Aluminum
    specularColor: '#ffffff',
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 0.92,
    titleFa: 'رخ آلومینیوم صیقلی'
  },
  // 6. سربازان: آهن گداخته و فولاد دمشقی (Forged Damascus Meteoric Iron)
  p: {
    baseColor: '#475569', // Dark Meteoric Iron
    specularColor: '#64748b',
    metalness: 0.82,
    roughness: 0.35,
    clearcoat: 0.60,
    titleFa: 'سرباز آهنی فورج‌شده'
  }
};

export const ChessPiece3D: React.FC<ChessPiece3DProps> = ({
  type,
  color,
  isSelected = false,
  enableMetallurgy = true
}) => {
  const isWhite = color === 'w';

  // Primary Material computation - Maintains fundamental metal identity
  const primaryMaterial = useMemo(() => {
    const config = ALCHEMY_PALETTE[type];
    // Slightly adjust tone for dark team patina without losing metal identity
    const baseColor = isWhite ? config.baseColor : THREE.Color.NAMES[type === 'r' ? 'slategrey' : 'darkgoldenrod'] || config.baseColor;
    
    // Create distinct physical material for each piece type
    let col = config.baseColor;
    if (!isWhite) {
      if (type === 'k') col = '#d97706'; // Deep Royal Gold Patina
      else if (type === 'q') col = '#ca8a04'; // Deep Gold
      else if (type === 'b') col = '#b45309'; // Antique Deep Bronze
      else if (type === 'n') col = '#542609'; // Deep Ebony Wood
      else if (type === 'r') col = '#94a3b8'; // Dark Anodized Aluminum
      else if (type === 'p') col = '#334155'; // Dark Damascus Iron
    }

    return new THREE.MeshPhysicalMaterial({
      color: col,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: config.clearcoat,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95
    });
  }, [type, isWhite]);

  // Team Accent & Trim Ring (Emerald/Gold for White Team vs Ruby/Crimson for Black Team)
  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isWhite ? '#10b981' : '#f43f5e',
      metalness: 0.9,
      roughness: 0.2,
      emissive: isWhite ? '#047857' : '#be123c',
      emissiveIntensity: isSelected ? 0.8 : 0.4
    });
  }, [isWhite, isSelected]);

  // Pure Sterling Silver Material for Vizier accents on Queen (Regardless of team)
  const silverVizierMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 0.98,
      clearcoatRoughness: 0.05
    });
  }, []);

  // Base plinth material (Ivory White Marble for White Team vs Obsidian Black Basalt for Black Team)
  const plinthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isWhite ? '#f8fafc' : '#0f172a',
      metalness: isWhite ? 0.3 : 0.7,
      roughness: 0.25
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
