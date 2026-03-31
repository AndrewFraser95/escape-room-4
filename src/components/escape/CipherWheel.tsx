import React, { useState } from "react";
import { useGame } from "./GameContext";
import { motion } from "framer-motion";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ANSWER = "TRICKY";
const RING_COUNT = 6; // one ring per letter

// Function to generate 6 random letters with one being the correct answer
const generateRingLetters = (correctLetter: string): string[] => {
  const letters = [correctLetter];
  while (letters.length < 6) {
    const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    if (!letters.includes(randomLetter)) {
      letters.push(randomLetter);
    }
  }
  // Shuffle the array
  return letters.sort(() => Math.random() - 0.5);
};

// Pre-generate the ring letter sets
const RING_LETTERS = ANSWER.split("").map((letter) =>
  generateRingLetters(letter)
);

const CipherWheel: React.FC = () => {
  const { solveChallenge, solvedChallenges } = useGame();
  const solved = solvedChallenges[1];
  const [rotations, setRotations] = useState<number[]>(Array(RING_COUNT).fill(0));

  const rotate = (ringIndex: number, direction: 1 | -1) => {
    if (solved) return;
    setRotations((prev) => {
      const next = [...prev];
      next[ringIndex] = (next[ringIndex] + direction + 6) % 6;
      return next;
    });
  };

  const currentLetters = rotations.map((r, i) => RING_LETTERS[i][r]);
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

  // Text color based on background for accessibility
  const getTextColor = (ringIndex: number) => {
    // Sage (green) backgrounds at indices 0 and 3 need white text
    if (ringIndex === 0 || ringIndex === 3) return "text-white";
    return "text-foreground";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          The Cipher Rings
        </h2>
        <p className="text-muted-foreground font-body">
          Six rings, each bearing six letters. Rotate them to find the mystery word.
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
                solved ? "bg-primary text-primary-foreground" : ringColors[i] + " " + getTextColor(i)
              } transition-all duration-300 shadow-md`}>
                {RING_LETTERS[i][rot]}
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
          The cipher unlocks: TRICKY!
        </motion.div>
      )}
    </div>
  );
};

export default CipherWheel;
