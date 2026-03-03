import React from "react";
import { useGame } from "./GameContext";
import { motion } from "framer-motion";

const CHALLENGES = [
  { name: "Hidden Form", icon: "🐰" },
  { name: "Cipher Rings", icon: "🔤" },
  { name: "Dotted Path", icon: "🥚" },
  { name: "Spring Melody", icon: "🎵" },
];

const ChallengeNav: React.FC = () => {
  const { currentChallenge, solvedChallenges, goToChallenge } = useGame();

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {CHALLENGES.map((ch, i) => {
        const isSolved = solvedChallenges[i];
        const isCurrent = currentChallenge === i;

        return (
          <motion.button
            key={i}
            onClick={() => goToChallenge(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-lg font-body text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isCurrent
                ? "bg-primary text-primary-foreground shadow-md"
                : isSolved
                ? "bg-spring-sage text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            } border border-border`}
          >
            <span>{ch.icon}</span>
            <span>{ch.name}</span>
            {isSolved && <span className="ml-1">✓</span>}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChallengeNav;
