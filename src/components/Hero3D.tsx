'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Stars, Sparkles, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Geometries() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Gentle rotation of the entire group
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    });

    const materialProps = {
        thickness: 0.2,
        roughness: 0,
        transmission: 1,
        ior: 1.2,
        chromaticAberration: 0.02,
        backside: true,
    };

    return (
        <group ref={groupRef}>
            {/* Central Icosahedron - Blue */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 0, 0]} scale={1.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial {...materialProps} color="#3b82f6" resolution={512} samples={6} />
                </mesh>
            </Float>

            {/* Floating Torus - Purple */}
            <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
                <mesh position={[-2, 1.5, -1]} scale={0.8} rotation={[0.5, 0.5, 0]}>
                    <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
                    <MeshTransmissionMaterial {...materialProps} color="#8b5cf6" resolution={512} samples={6} />
                </mesh>
            </Float>

            {/* Floating Octahedron - Pink */}
            <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
                <mesh position={[2.5, -1, -2]} scale={1}>
                    <octahedronGeometry />
                    <MeshTransmissionMaterial {...materialProps} color="#ec4899" resolution={512} samples={6} />
                </mesh>
            </Float>

            {/* Small floating particles/cubes */}
            <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[-1, -2, 1]} scale={0.3}>
                    <boxGeometry />
                    <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
                </mesh>
            </Float>
        </group>
    );
}

export default function Hero3D() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

                <Geometries />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={40} scale={8} size={4} speed={0.4} opacity={0.5} color="#60a5fa" />

                {/* Environment for reflections */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
