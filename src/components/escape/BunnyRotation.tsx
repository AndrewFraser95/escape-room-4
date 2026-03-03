import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "./GameContext";
import { motion } from "framer-motion";

// Create scattered 3D points that form a bunny silhouette when viewed from the correct angle
function BunnyPoints({ onSolved }: { onSolved: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [solved, setSolved] = useState(false);
  const checkInterval = useRef(0);

  // Bunny silhouette points in 2D, we'll scatter them in 3D
  const bunnyProfile = useMemo(() => {
    // Simple bunny outline points (x, y)
    const outline: [number, number][] = [
      // Left ear
      [-0.3, 1.8], [-0.35, 2.2], [-0.3, 2.6], [-0.2, 2.9], [-0.1, 3.1],
      [0.0, 3.2], [0.05, 2.9], [0.0, 2.5], [-0.05, 2.1],
      // Right ear
      [0.2, 1.8], [0.25, 2.2], [0.3, 2.6], [0.35, 2.9], [0.2, 3.1],
      [0.1, 2.8], [0.15, 2.4], [0.1, 2.0],
      // Head
      [-0.5, 1.5], [-0.6, 1.2], [-0.6, 0.9], [-0.5, 0.6],
      [0.5, 1.5], [0.6, 1.2], [0.6, 0.9], [0.5, 0.6],
      // Eyes
      [-0.2, 1.2], [0.2, 1.2],
      // Nose
      [0.0, 0.9],
      // Body
      [-0.5, 0.4], [-0.6, 0.0], [-0.6, -0.4], [-0.5, -0.8], [-0.3, -1.1],
      [0.5, 0.4], [0.6, 0.0], [0.6, -0.4], [0.5, -0.8], [0.3, -1.1],
      // Bottom
      [-0.1, -1.2], [0.0, -1.2], [0.1, -1.2],
      // Tail
      [0.6, -0.5], [0.75, -0.4], [0.7, -0.6],
      // Feet
      [-0.4, -1.2], [-0.5, -1.3], [-0.3, -1.35],
      [0.4, -1.2], [0.5, -1.3], [0.3, -1.35],
    ];
    return outline;
  }, []);

  // Create 3D positions: the bunny is visible along -Z axis
  const points = useMemo(() => {
    return bunnyProfile.map(([x, y]) => {
      // Scatter in Z so it looks random from most angles
      const z = (Math.random() - 0.5) * 3;
      return new THREE.Vector3(x, y - 1, z);
    });
  }, [bunnyProfile]);

  // Lines connecting nearby bunny points to form the silhouette from the correct angle
  const lineSegments = useMemo(() => {
    const segs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < bunnyProfile.length; i++) {
      for (let j = i + 1; j < bunnyProfile.length; j++) {
        const dx = bunnyProfile[i][0] - bunnyProfile[j][0];
        const dy = bunnyProfile[i][1] - bunnyProfile[j][1];
        const dist2d = Math.sqrt(dx * dx + dy * dy);
        if (dist2d < 0.45) {
          segs.push([points[i], points[j]]);
        }
      }
    }
    return segs;
  }, [bunnyProfile, points]);

  useFrame(({ camera }) => {
    if (solved) return;
    checkInterval.current++;
    if (checkInterval.current % 15 !== 0) return;

    // Check if camera is looking along -Z (front view)
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    // We want the user to look along -Z (dir.z close to -1, dir.x and dir.y close to 0)
    const isAligned = Math.abs(dir.z + 1) < 0.15 && Math.abs(dir.x) < 0.15 && Math.abs(dir.y) < 0.15;

    if (isAligned) {
      setSolved(true);
      onSolved();
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={solved ? "#5a8a6a" : "#8a7a5a"} />
        </mesh>
      ))}
      {lineSegments.map(([a, b], i) => (
        <LineSeg key={i} start={a} end={b} solved={solved} />
      ))}
    </group>
  );
}

function LineSeg({ start, end, solved }: { start: THREE.Vector3; end: THREE.Vector3; solved: boolean }) {
  const ref = useRef<THREE.Line>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints([start, end]);
    return geo;
  }, [start, end]);

  const material = useMemo(() => new THREE.LineBasicMaterial({ color: solved ? "#5a8a6a" : "#a09070" }), [solved]);

  return <primitive object={new THREE.Line(geometry, material)} />;
}

const BunnyRotation: React.FC = () => {
  const { solveChallenge, solvedChallenges } = useGame();
  const solved = solvedChallenges[0];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          The Hidden Form
        </h2>
        <p className="text-muted-foreground font-body">
          Within this cloud of scattered points hides a familiar spring creature. 
          Rotate the view until the silhouette reveals itself.
        </p>
      </div>

      <div className="w-full max-w-lg aspect-square rounded-lg overflow-hidden glass-card challenge-glow">
        <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <BunnyPoints onSolved={() => solveChallenge(0)} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-display text-xl font-semibold"
        >
          🐰 The bunny reveals itself!
        </motion.div>
      )}
    </div>
  );
};

export default BunnyRotation;
