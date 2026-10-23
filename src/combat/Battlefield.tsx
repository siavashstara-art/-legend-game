import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';

export const Battlefield = () => {
  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* میدان نبرد اولیه (یک صفحه ساده) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  );
};
