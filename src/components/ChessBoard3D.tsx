import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { Chess } from 'chess.js';
import { ChessPiece3D } from './ChessPiece3D.tsx';

const Board = ({ game }: { game: Chess }) => {
  const board = game.board();
  
  return (
    <group>
      {/* Board Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[8.5, 8.5, 0.4]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.2} metalness={0.1} clearcoat={1} />
      </mesh>
      
      {/* Pieces */}
      {board.map((row, rowIndex) => 
        row.map((piece, colIndex) => {
          if (!piece) return null;
          // Map 8x8 grid to -3.5 to 3.5 range in 3D
          const x = colIndex - 3.5;
          const z = rowIndex - 3.5;
          return (
            <group key={`${rowIndex}-${colIndex}`} position={[x, 0, z]}>
              <ChessPiece3D type={piece.type} color={piece.color} />
            </group>
          );
        })
      )}
    </group>
  );
};

export const ChessBoard3D: React.FC<{ theme: string, game: Chess }> = ({ theme, game }) => {
  return (
    <div className="w-full h-[400px] sm:h-[500px] bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-inner">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 6, 8]} fov={50} />
        <OrbitControls 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.2} 
          enablePan={false}
        />
        
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow />
        <Environment preset="city" />

        <Board game={game} />
        <ContactShadows position={[0, -0.2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
};
