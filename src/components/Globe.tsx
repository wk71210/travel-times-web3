'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Location data
const LOCATIONS = [
  { name: 'APEX', lat: 40.7128, lon: -74.0060, type: 'event' },
  { name: 'NETWORK SCHOOL', lat: 51.5074, lon: -0.1278, type: 'school' },
  { name: 'MIAMI', lat: 25.7617, lon: -80.1918, type: 'hub' },
  { name: 'DUBAI', lat: 25.2048, lon: 55.2708, type: 'hub' },
  { name: 'SINGAPORE', lat: 1.3521, lon: 103.8198, type: 'hub' },
];

// Convert lat/lon to 3D position
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

// Earth Sphere Component
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Create earth texture using canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('22')!;
    
    // Dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines (latitude/longitude)
    ctx.strokeStyle = '#1a3d2e';
    ctx.lineWidth = 1;
    
    // Latitude lines
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Longitude lines
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Random dots for cities/connections
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      ctx.globalAlpha = Math.random() * 0.5 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial 
        map={earthTexture}
        emissive="#10b981"
        emissiveIntensity={0.1}
        roughness={0.8}
        metalness={0.2}
      />
      
      {/* Atmosphere glow */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial 
          color="#10b981"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}

// Location Marker Component
function LocationMarker({ 
  position, 
  name, 
  type 
}: { 
  position: THREE.Vector3; 
  name: string; 
  type: string;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Pulse animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Marker dot */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      
      {/* Glow ring */}
      <mesh ref={groupRef}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial 
          color="#10b981" 
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Label */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-emerald-500/50">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection Lines between locations
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const points = useMemo(() => {
    const positions: number[] = [];
    
    LOCATIONS.forEach((loc1, i) => {
      LOCATIONS.forEach((loc2, j) => {
        if (i < j) {
          const pos1 = latLonToVector3(loc1.lat, loc1.lon, 2.02);
          const pos2 = latLonToVector3(loc2.lat, loc2.lon, 2.02);
          
          // Create curved line
          const midPoint = pos1.clone().add(pos2).multiplyScalar(0.5);
          midPoint.normalize().multiplyScalar(2.5); // Arc height
          
          const curve = new THREE.QuadraticBezierCurve3(pos1, midPoint, pos2);
          const curvePoints = curve.getPoints(50);
          
          curvePoints.forEach((point, idx) => {
            if (idx < curvePoints.length - 1) {
              positions.push(point.x, point.y, point.z);
              positions.push(
                curvePoints[idx + 1].x,
                curvePoints[idx + 1].y,
                curvePoints[idx + 1].z
              );
            }
          });
        }
      });
    });
    
    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#10b981" transparent opacity={0.3} />
    </lineSegments>
  );
}

// Main Globe Scene
function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Earth />
      
      {/* Location Markers */}
      {LOCATIONS.map((loc) => (
        <LocationMarker
          key={loc.name}
          position={latLonToVector3(loc.lat, loc.lon, 2.05)}
          name={loc.name}
          type={loc.type}
        />
      ))}
      
      <ConnectionLines />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-nomad-dark via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
