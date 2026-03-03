import React, { useState } from "react";
import { useGame } from "./GameContext";
import { motion } from "framer-motion";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ANSWER = "SPRING";
const RING_COUNT = 6; // one ring per letter

const CipherWheel: React.FC = () => {
  const { solveChallenge, solvedChallenges } = useGame();
  const solved = solvedChallenges[1];
  const [rotations, setRotations] = useState<number[]>(Array(RING_COUNT).fill(0));

  const rotate = (ringIndex: number, direction: 1 | -1) => {
    if (solved) return;
    setRotations((prev) => {
      const next = [...prev];
      next[ringIndex] = (next[ringIndex] + direction + 26) % 26;
      return next;
    });
  };

  const currentLetters = rotations.map((r) => ALPHABET[r]);
  const currentWord = currentLetters.join("");

  React.useEffect(() => {
    if (currentWord === ANSWER && !solved) {
      solveChallenge(1);
    }
  }, [currentWord, solved, solveChallenge]);

  const ringColors = [
    "bg-spring-sage", "bg-spring-honey", "bg-spring-coral",
    "bg-spring-sage", "bg-spring-honey", "bg-spring-coral",
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          The Cipher Rings
        </h2>
        <p className="text-muted-foreground font-body">
          Six rings, each bearing the alphabet. Rotate them to spell the season 
          when new life begins. <span className="text-accent font-medium">Hint: What follows winter?</span>
        </p>
      </div>

      <div className="glass-card challenge-glow rounded-xl p-8">
        <div className="flex gap-3 items-center">
          {rotations.map((rot, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button
                onClick={() => rotate(i, -1)}
                className="w-10 h-8 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-sm font-body"
                disabled={solved}
              >
                ▲
              </button>
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-display font-bold ${
                solved ? "bg-primary text-primary-foreground" : ringColors[i] + " text-foreground"
              } transition-all duration-300 shadow-md`}>
                {ALPHABET[rot]}
              </div>
              <button
                onClick={() => rotate(i, 1)}
                className="w-10 h-8 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-sm font-body"
                disabled={solved}
              >
                ▼
              </button>
            </div>
          ))}
        </div>
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-display text-xl font-semibold"
        >
          🌸 The cipher unlocks: SPRING!
        </motion.div>
      )}
    </div>
  );
};

export default CipherWheel;
