import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Text, Sparkles } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Chess, Square } from 'chess.js';
import { ChessPiece3D } from './ChessPiece3D.tsx';
import { BoardTheme, PieceType, Color } from '../types/chess.ts';
import { Eye, RotateCw, Maximize2, Minimize2, Sparkles as SparklesIcon, Compass } from 'lucide-react';
import { getProceduralWoodTexture } from '../utils/proceduralTextures.ts';

interface ChessBoard3DProps {
  game: Chess;
  selectedSquare: Square | null;
  validTargets: Square[];
  lastMove: { from: Square; to: Square } | null;
  flipped: boolean;
  theme: BoardTheme;
  enableMetallurgy?: boolean;
  clashSquare?: Square | null;
  onSquareClick: (square: Square) => void;
  isGameOver: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const THEMES: Record<string, { light: string; dark: string; border: string; trim: string }> = {
  walnut: { light: '#e8d4a8', dark: '#a8774a', border: '#3e2723', trim: '#d97706' },
  emerald: { light: '#eeeed2', dark: '#769656', border: '#1e392a', trim: '#10b981' },
  slate: { light: '#e2e8f0', dark: '#64748b', border: '#1e293b', trim: '#38bdf8' },
  amber: { light: '#fef3c7', dark: '#d97706', border: '#451a03', trim: '#f59e0b' },
  apadana: { light: '#ccfbf1', dark: '#0f766e', border: '#134e4a', trim: '#eab308' },
  persepolis: { light: '#e7e5e4', dark: '#78350f', border: '#291307', trim: '#f59e0b' },
  camelot: { light: '#f1f5f9', dark: '#1e3a8a', border: '#0f172a', trim: '#60a5fa' },
  colosseum: { light: '#fef3c7', dark: '#881337', border: '#3b0716', trim: '#f43f5e' },
  olympus: { light: '#e0f2fe', dark: '#0284c7', border: '#082f49', trim: '#38bdf8' },
  pyramids: { light: '#fef9c3', dark: '#854d0e', border: '#3a2007', trim: '#fbbf24' },
  sakura: { light: '#fff1f2', dark: '#9f1239', border: '#4c0519', trim: '#fb7185' },
  petra: { light: '#ffe4e6', dark: '#9f1239', border: '#360914', trim: '#f43f5e' },
  fjords: { light: '#e2e8f0', dark: '#334155', border: '#090d16', trim: '#94a3b8' },
  topkapi: { light: '#f0fdf4', dark: '#0f766e', border: '#14532d', trim: '#eab308' },
  forbidden_city: { light: '#fef3c7', dark: '#991b1b', border: '#450a0a', trim: '#fbbf24' },
  taj_mahal: { light: '#fdf4ff', dark: '#701a75', border: '#4a044e', trim: '#e879f9' },
  hermitage: { light: '#ecfdf5', dark: '#047857', border: '#064e3b', trim: '#34d399' }
};

// 3D Square Tile component
const SquareTile = ({
  x,
  z,
  square,
  isLight,
  themeLight,
  themeDark,
  isSelected,
  isValidTarget,
  isLastMove,
  isCheck,
  isClash,
  texture,
  onClick
}: {
  x: number;
  z: number;
  square: Square;
  isLight: boolean;
  themeLight: string;
  themeDark: string;
  isSelected: boolean;
  isValidTarget: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  isClash: boolean;
  texture?: THREE.CanvasTexture;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  // Dynamic tile color
  let tileColor = isLight ? themeLight : themeDark;
  let roughness = isLight ? 0.35 : 0.45;
  let metalness = 0.15;

  if (isSelected) {
    tileColor = '#f59e0b'; // Radiant amber
    metalness = 0.7;
    roughness = 0.15;
  } else if (isCheck) {
    tileColor = '#ef4444'; // Red check warning
    metalness = 0.5;
  } else if (isClash) {
    tileColor = '#facc15'; // Golden clash impact
    metalness = 0.8;
  } else if (isLastMove) {
    tileColor = isLight ? '#fde047' : '#ca8a04'; // Warm move highlight
    metalness = 0.4;
  } else if (hovered) {
    tileColor = isLight ? '#ffffff' : '#475569';
  }

  return (
    <group position={[x, 0, z]}>
      {/* 3D Chamfered Tile Box with Wood Grain Finish */}
      <mesh
        position={[0, hovered ? 0.03 : 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.97, 0.14, 0.97]} />
        <meshPhysicalMaterial
          map={texture}
          color={tileColor}
          roughness={roughness}
          metalness={metalness}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Valid Move Target Gemstone Indicator */}
      {isValidTarget && (
        <group position={[0, 0.14, 0]}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={1.0}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* Selection Column Beam */}
      {isSelected && (
        <group position={[0, 0.45, 0]}>
          <mesh>
            <cylinderGeometry args={[0.44, 0.44, 0.75, 24, 1, true]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <ringGeometry args={[0.35, 0.46, 32]} />
            <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Check Alert Ring */}
      {isCheck && (
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.48, 32]} />
          <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// 3D Scene containing Board, Frame, Pieces, and Lighting
const BoardScene = ({
  game,
  selectedSquare,
  validTargets,
  lastMove,
  flipped,
  theme,
  enableMetallurgy,
  clashSquare,
  onSquareClick,
  isGameOver
}: ChessBoard3DProps) => {
  const currentTheme = THEMES[theme] || THEMES.apadana;
  const board = game.board();
  const inCheck = game.inCheck();
  const currentTurn = game.turn();

  // Find King square if in check
  const kingSquareInCheck = useMemo<Square | null>(() => {
    if (!inCheck) return null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          return `${FILES[c]}${8 - r}` as Square;
        }
      }
    }
    return null;
  }, [inCheck, board, currentTurn]);

  // Textures for realistic tournament board
  const mapleTex = useMemo(() => getProceduralWoodTexture('light_maple'), []);
  const walnutTex = useMemo(() => getProceduralWoodTexture('dark_walnut'), []);
  const borderTex = useMemo(() => getProceduralWoodTexture('border_rosewood'), []);

  // Flip rotation
  const boardRotationY = flipped ? Math.PI : 0;

  return (
    <group rotation={[0, boardRotationY, 0]}>
      {/* Outer Luxury Frame Base */}
      <mesh position={[0, -0.22, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.5, 0.32, 9.5]} />
        <meshPhysicalMaterial
          map={borderTex}
          color={currentTheme.border}
          roughness={0.3}
          metalness={0.25}
          clearcoat={0.8}
        />
      </mesh>

      {/* Underside Tournament Green Felt Pad */}
      <mesh position={[0, -0.385, 0]} receiveShadow>
        <boxGeometry args={[9.2, 0.02, 9.2]} />
        <meshStandardMaterial color="#064e3b" roughness={0.9} />
      </mesh>

      {/* 4 Antique Brass Corner Inlay Brackets */}
      {[
        [-4.5, -4.5],
        [4.5, -4.5],
        [-4.5, 4.5],
        [4.5, 4.5]
      ].map(([cx, cz], i) => (
        <mesh key={`corner-${i}`} position={[cx, -0.05, cz]} receiveShadow>
          <boxGeometry args={[0.35, 0.08, 0.35]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* Gold Trim Inlay Rim */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.45, 0.10, 8.45]} />
        <meshStandardMaterial
          color={currentTheme.trim}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Board Bed Recess */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[8.1, 0.04, 8.1]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.8} />
      </mesh>

      {/* 64 Chess Squares */}
      {Array.from({ length: 8 }).map((_, rowIndex) =>
        Array.from({ length: 8 }).map((_, colIndex) => {
          const square = `${FILES[colIndex]}${8 - rowIndex}` as Square;
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const isSelected = selectedSquare === square;
          const isValidTarget = validTargets.includes(square);
          const isLast = lastMove ? lastMove.from === square || lastMove.to === square : false;
          const isCheck = kingSquareInCheck === square;
          const isClash = clashSquare === square;

          // Coordinate mapping: colIndex 0..7 -> -3.5..+3.5, rowIndex 0..7 -> -3.5..+3.5
          const x = colIndex - 3.5;
          const z = rowIndex - 3.5;

          return (
            <SquareTile
              key={square}
              x={x}
              z={z}
              square={square}
              isLight={isLight}
              themeLight={currentTheme.light}
              themeDark={currentTheme.dark}
              isSelected={isSelected}
              isValidTarget={isValidTarget}
              isLastMove={isLast}
              isCheck={isCheck}
              isClash={isClash}
              texture={isLight ? mapleTex : walnutTex}
              onClick={() => onSquareClick(square)}
            />
          );
        })
      )}

      {/* 3D Chess Pieces */}
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          if (!piece) return null;
          const square = `${FILES[colIndex]}${8 - rowIndex}` as Square;
          const isSelected = selectedSquare === square;
          const x = colIndex - 3.5;
          const z = rowIndex - 3.5;

          return (
            <group
              key={`piece-${rowIndex}-${colIndex}`}
              position={[x, 0.07, z]}
              onClick={(e) => {
                e.stopPropagation();
                onSquareClick(square);
              }}
            >
              <ChessPiece3D
                type={piece.type as PieceType}
                color={piece.color as Color}
                isSelected={isSelected}
                enableMetallurgy={enableMetallurgy}
              />
            </group>
          );
        })
      )}

      {/* Coordinates: Files A-H */}
      {FILES.map((file, i) => (
        <group key={`file-${file}`} position={[i - 3.5, 0.02, 4.45]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            fontSize={0.28}
            color="#facc15"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {file.toUpperCase()}
          </Text>
        </group>
      ))}

      {/* Coordinates: Ranks 1-8 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`rank-${i}`} position={[-4.45, 0.02, i - 3.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <Text
            fontSize={0.28}
            color="#facc15"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {8 - i}
          </Text>
        </group>
      ))}
    </group>
  );
};

export const ChessBoard3D: React.FC<ChessBoard3DProps> = (props) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'topdown'>('perspective');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleViewAngle = () => {
    if (controlsRef.current) {
      if (cameraPreset === 'perspective') {
        controlsRef.current.object.position.set(0, 11, 0.01);
        setCameraPreset('topdown');
      } else {
        controlsRef.current.object.position.set(0, 7.5, 8.5);
        setCameraPreset('perspective');
      }
      controlsRef.current.update();
    }
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-0 z-50 h-screen w-screen bg-[#0d0a08] p-3'
          : 'h-[440px] sm:h-[550px] rounded-2xl'
      } bg-gradient-to-b from-[#14100c] via-[#1a1410] to-[#0c0907] overflow-hidden shadow-2xl border border-amber-900/40 select-none`}
    >
      {/* 3D Engine Status & Theme Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
        <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/50 text-xs font-black text-amber-300 flex items-center gap-2 shadow-lg">
          <SparklesIcon size={14} className="text-amber-400 animate-pulse" />
          <span>موتور سه‌بعدی Three.js اساطیری فعال است</span>
        </div>
      </div>

      {/* Camera Controls & Fullscreen */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleToggleViewAngle}
          className="p-1.5 px-2.5 rounded-xl bg-black/80 hover:bg-black/95 backdrop-blur-md border border-amber-700/60 text-amber-200 text-xs font-bold transition-all cursor-pointer shadow-lg flex items-center gap-1.5 active:scale-95"
          title="تغییر زاویه دید بین سه‌بعدی مایل و ۲.۵D عمودی"
        >
          <Compass size={14} className="text-amber-400" />
          <span className="hidden sm:inline">
            {cameraPreset === 'perspective' ? 'زاویه استراتژیک ۲.۵D' : 'زاویه اساطیری ۳D'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-black/80 hover:bg-black/95 backdrop-blur-md border border-amber-700/60 text-amber-200 transition-all cursor-pointer shadow-lg active:scale-95"
          title="تنظیم مجدد زاویه دوربین"
        >
          <RotateCw size={15} />
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="p-2 rounded-xl bg-black/80 hover:bg-black/95 backdrop-blur-md border border-amber-700/60 text-amber-200 transition-all cursor-pointer shadow-lg active:scale-95"
          title={isExpanded ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه و تمرکز'}
        >
          {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* Interactive Helper Overlay at Bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-900/50 text-[11px] font-medium text-stone-200 pointer-events-none flex items-center gap-2.5 shadow-xl">
        <span className="text-amber-400 font-bold">چرخش آزاد:</span>
        <span>درگ موس یا لمس</span>
        <span className="text-amber-500">•</span>
        <span className="text-amber-400 font-bold">زوم:</span>
        <span>اسکرول</span>
        <span className="text-amber-500">•</span>
        <span className="text-amber-400 font-bold">حرکت:</span>
        <span>لمس مهره و خانه مقصد</span>
      </div>

      {/* Three.js Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 7.8, 8.8]} fov={45} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={5}
          maxDistance={16}
          minPolarAngle={Math.PI / 12}
          maxPolarAngle={Math.PI / 2.25}
          enablePan={false}
        />

        {/* Cinematic Studio Lighting Rig */}
        <ambientLight intensity={0.65} />
        
        {/* Main Key Spotlight with Sharp Specular Highlights & Shadows */}
        <spotLight
          position={[7, 13, 8]}
          angle={0.45}
          penumbra={0.7}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={25}
        />

        {/* Cool Rim Light from Back to Sculpt 3D Edges */}
        <directionalLight position={[-8, 7, -8]} intensity={0.6} color="#7dd3fc" />

        {/* Warm Golden Core Fill Light */}
        <pointLight position={[0, 4.5, 0]} intensity={0.45} color="#fbbf24" distance={10} />

        {/* Floating Alchemical Stardust */}
        <Sparkles count={45} scale={11} size={2.5} speed={0.35} opacity={0.45} color="#f59e0b" />

        {/* Main Board Scene */}
        <BoardScene {...props} />

        {/* Realistic Floor Contact Shadows */}
        <ContactShadows
          position={[0, -0.38, 0]}
          opacity={0.7}
          scale={15}
          blur={1.8}
          far={6}
        />
      </Canvas>
    </div>
  );
};
