import React, { useState } from "react";
import { useGame } from "./GameContext";
import { motion } from "framer-motion";

const BunnyRotation: React.FC = () => {
  const { solveChallenge, solvedChallenges } = useGame();
  const solved = solvedChallenges[0];
  const [rotationX, setRotationX] = useState(180); // Vertical (up/down) rotation - start upside down
  const [rotationY, setRotationY] = useState(60); // Horizontal (left/right) rotation

  // Bunny FACE made of dots - simple and recognizable
  // Only looks like a bunny face when rotation is 0
  const bunnyDots = [
    // Left ear (fat and tall)
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
    { x: 2, y: 5 },
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    // Right ear (fat and tall)
    { x: 5, y: 2 },
    { x: 5, y: 3 },
    { x: 5, y: 4 },
    { x: 5, y: 5 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 6, y: 4 },
    { x: 6, y: 5 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    // Head - top
    { x: 3, y: 6 },
    { x: 4, y: 6 },
    { x: 5, y: 6 },
    // Head - upper
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
    { x: 5, y: 7 },
    { x: 6, y: 7 },
    // Head - middle (with eyes)
    { x: 2, y: 8 },
    { x: 3, y: 8 }, // Left eye
    { x: 4, y: 8 }, // Center
    { x: 5, y: 8 }, // Right eye
    { x: 6, y: 8 },
    // Head - lower (with nose)
    { x: 2, y: 9 },
    { x: 3, y: 9 },
    { x: 4, y: 9 }, // Nose
    { x: 5, y: 9 },
    { x: 6, y: 9 },
    // Head - bottom (smile/mouth)
    { x: 3, y: 10 },
    { x: 4, y: 10 },
    { x: 5, y: 10 },
  ];

  const rotateDot = (dot: { x: number; y: number }) => {
    // Just return as-is, rotation will be handled by CSS 3D transforms
    return dot;
  };

  const rotatedDots = bunnyDots.map((dot) => rotateDot(dot));

  const handleRotateUp = () => {
    setRotationX((prev) => Math.max(prev - 30, -180));
  };

  const handleRotateDown = () => {
    setRotationX((prev) => Math.min(prev + 30, 180));
  };

  const handleRotateLeft = () => {
    setRotationY((prev) => (prev - 30 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotationY((prev) => (prev + 30) % 360);
  };

  React.useEffect(() => {
    // Check if rotation is correct (both at 0 = straight on)
    if (Math.abs(rotationX) < 2 && Math.abs(rotationY) < 2 && !solved) {
      solveChallenge(0);
    }
  }, [rotationX, rotationY, solved, solveChallenge]);

  const DOT_SIZE = 25;
  const DOT_RADIUS = 6;
  const PADDING = 50;

  // Calculate bounds
  const minX = Math.min(...rotatedDots.map((d) => d.x));
  const maxX = Math.max(...rotatedDots.map((d) => d.x));
  const minY = Math.min(...rotatedDots.map((d) => d.y));
  const maxY = Math.max(...rotatedDots.map((d) => d.y));

  const width =
    (maxX - minX + 1) * DOT_SIZE + PADDING * 2;
  const height =
    (maxY - minY + 1) * DOT_SIZE + PADDING * 2;

  const offsetX = -minX * DOT_SIZE + PADDING;
  const offsetY = -minY * DOT_SIZE + PADDING;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          The Hidden Form
        </h2>
        <p className="text-muted-foreground font-body">
          Rotate the dots until you reveal the spring creature hiding within.
          Look for a familiar hopping friend!
        </p>
      </div>

      <div className="glass-card challenge-glow rounded-xl p-8" style={{ perspective: "1000px" }}>
        <div
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease-out",
          }}
        >
          <svg width={width} height={height} className="select-none">
            {rotatedDots.map((dot, i) => (
              <circle
                key={i}
                cx={dot.x * DOT_SIZE + offsetX}
                cy={dot.y * DOT_SIZE + offsetY}
                r={DOT_RADIUS}
                fill={solved ? "hsl(150, 25%, 35%)" : "hsl(38, 60%, 62%)"}
                className="transition-colors duration-300"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRotateLeft}
            className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-primary transition-colors font-body font-semibold disabled:opacity-50"
            disabled={solved}
          >
            ← Left
          </button>
          <button
            onClick={handleRotateRight}
            className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-primary transition-colors font-body font-semibold disabled:opacity-50"
            disabled={solved}
          >
            Right →
          </button>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRotateUp}
            className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-primary transition-colors font-body font-semibold disabled:opacity-50"
            disabled={solved}
          >
            ⬆ Up
          </button>
          <button
            onClick={handleRotateDown}
            className="px-6 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-primary transition-colors font-body font-semibold disabled:opacity-50"
            disabled={solved}
          >
            Down ⬇
          </button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground font-body">
        Rotation X: {rotationX.toFixed(0)}° Y: {rotationY.toFixed(0)}°
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
