import React from 'react';
import * as THREE from 'three';

// Material definitions for the 6 Alchemical Elements
const METALS: Record<string, { color: string, metalness: number, roughness: number }> = {
  k: { color: '#f0c04a', metalness: 0.9, roughness: 0.2 }, // Gold King
  q: { color: '#e0e0e0', metalness: 0.9, roughness: 0.2 }, // Silver Queen
  b: { color: '#cd7f32', metalness: 0.8, roughness: 0.3 }, // Bronze Bishop
  n: { color: '#8b4513', metalness: 0.0, roughness: 0.8 }, // Wood Knight
  r: { color: '#a0a0a0', metalness: 0.7, roughness: 0.4 }, // Aluminum Rook
  p: { color: '#505050', metalness: 0.6, roughness: 0.5 }, // Iron Pawn
};

export const ChessPiece3D = ({ type, color }: { type: string, color: string }) => {
  const metal = METALS[type] || { color: '#ffffff', metalness: 0.5, roughness: 0.5 };
  
  // Apply a subtle darkening or brightening based on side if needed, 
  // but alchemical materials should look consistent.
  
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.4, 16]} />
        <meshPhysicalMaterial {...metal} />
      </mesh>
      
      {/* Body/Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        {type === 'k' ? (
          <coneGeometry args={[0.25, 0.8, 8]} />
        ) : type === 'q' ? (
          <sphereGeometry args={[0.25, 16, 16]} />
        ) : (
          <cylinderGeometry args={[0.15, 0.25, 0.8, 16]} />
        )}
        <meshPhysicalMaterial {...metal} />
      </mesh>
    </group>
  );
};
