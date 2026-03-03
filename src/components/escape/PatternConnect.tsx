import React, { useState, useRef } from "react";
import { useGame } from "./GameContext";
import { motion } from "framer-motion";

// 4x4 grid of dots, connect in egg shape pattern
const GRID_SIZE = 4;
const DOT_SPACING = 70;
const DOT_RADIUS = 12;

// The correct path forms an egg shape (indices in 4x4 grid, 0-15)
// Grid:  0  1  2  3
//        4  5  6  7
//        8  9 10 11
//       12 13 14 15
const CORRECT_PATH = [1, 2, 7, 11, 14, 13, 12, 8, 4, 1]; // egg outline

const PatternConnect: React.FC = () => {
  const { solveChallenge, solvedChallenges } = useGame();
  const solved = solvedChallenges[2];
  const [path, setPath] = useState<number[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [showError, setShowError] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getDotPos = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    return {
      x: col * DOT_SPACING + DOT_SPACING,
      y: row * DOT_SPACING + DOT_SPACING,
    };
  };

  const handleDotClick = (index: number) => {
    if (solved) return;

    if (!drawing) {
      setDrawing(true);
      setPath([index]);
      setShowError(false);
    } else {
      if (path.includes(index) && index === path[0] && path.length > 2) {
        // Closing the path
        const fullPath = [...path, index];
        checkSolution(fullPath);
        setDrawing(false);
      } else if (!path.includes(index)) {
        setPath([...path, index]);
      }
    }
  };

  const checkSolution = (attempt: number[]) => {
    // Normalize both paths for comparison (circular, direction-independent)
    const normalize = (p: number[]) => {
      const loop = p.slice(0, -1); // remove closing duplicate
      // Find minimum rotation
      let minStr = loop.join(",");
      for (let i = 1; i < loop.length; i++) {
        const rotated = [...loop.slice(i), ...loop.slice(0, i)].join(",");
        if (rotated < minStr) minStr = rotated;
      }
      // Also try reversed
      const rev = [...loop].reverse();
      for (let i = 0; i < rev.length; i++) {
        const rotated = [...rev.slice(i), ...rev.slice(0, i)].join(",");
        if (rotated < minStr) minStr = rotated;
      }
      return minStr;
    };

    if (normalize(attempt) === normalize(CORRECT_PATH)) {
      solveChallenge(2);
    } else {
      setShowError(true);
      setTimeout(() => {
        setPath([]);
        setShowError(false);
      }, 800);
    }
  };

  const resetPath = () => {
    setPath([]);
    setDrawing(false);
    setShowError(false);
  };

  const width = (GRID_SIZE + 1) * DOT_SPACING;
  const height = (GRID_SIZE + 1) * DOT_SPACING;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          The Dotted Path
        </h2>
        <p className="text-muted-foreground font-body">
          Connect the dots to trace the outline of an Easter symbol. 
          Click dots to draw, then click your starting dot to close the shape.
          <span className="text-accent font-medium"> Hint: Think oval.</span>
        </p>
      </div>

      <div className="glass-card challenge-glow rounded-xl p-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="select-none"
        >
          {/* Draw lines */}
          {path.length > 1 && path.map((_, i) => {
            if (i === 0) return null;
            const from = getDotPos(path[i - 1]);
            const to = getDotPos(path[i]);
            return (
              <line
                key={`line-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={showError ? "hsl(0, 65%, 50%)" : solved ? "hsl(150, 25%, 35%)" : "hsl(38, 60%, 62%)"}
                strokeWidth={3}
                strokeLinecap="round"
              />
            );
          })}

          {/* Draw dots */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const pos = getDotPos(i);
            const isInPath = path.includes(i);
            const isStart = path[0] === i;

            return (
              <g key={i} onClick={() => handleDotClick(i)} className="cursor-pointer">
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={DOT_RADIUS}
                  fill={
                    solved && isInPath
                      ? "hsl(150, 25%, 35%)"
                      : isInPath
                      ? "hsl(38, 60%, 62%)"
                      : "hsl(40, 20%, 85%)"
                  }
                  stroke={isStart && drawing ? "hsl(12, 55%, 62%)" : "transparent"}
                  strokeWidth={isStart && drawing ? 3 : 0}
                  className="transition-colors duration-200"
                />
                {isStart && drawing && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={DOT_RADIUS + 5}
                    fill="transparent"
                    stroke="hsl(12, 55%, 62%)"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    opacity={0.6}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3">
        {!solved && (
          <button
            onClick={resetPath}
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-body text-sm"
          >
            Reset Path
          </button>
        )}
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-display text-xl font-semibold"
        >
          🥚 The egg takes shape!
        </motion.div>
      )}
    </div>
  );
};

export default PatternConnect;
