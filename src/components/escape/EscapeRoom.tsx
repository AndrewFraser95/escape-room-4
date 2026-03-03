import React, { useEffect, useState } from "react";
import { GameProvider, useGame } from "./GameContext";
import ChallengeNav from "./ChallengeNav";
import BunnyRotation from "./BunnyRotation";
import CipherWheel from "./CipherWheel";
import PatternConnect from "./PatternConnect";
import SequenceMemory from "./SequenceMemory";
import { motion, AnimatePresence } from "framer-motion";

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const GameInner: React.FC = () => {
  const { currentChallenge, gameComplete, startTime, elapsedTime, startGame, resetGame, solvedChallenges } = useGame();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(() => {
      setTimer(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Landing screen
  if (currentChallenge === -1 && !gameComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <div className="text-6xl mb-6">🌼</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Spring Vault
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-8 leading-relaxed">
            Four challenges stand between you and the secrets of spring. 
            Solve each puzzle to unlock the vault before time runs out.
          </p>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            Begin the Hunt
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Victory screen
  if (gameComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <div className="text-7xl mb-6">🏆</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vault Unlocked!
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-2">
            You solved all four challenges in
          </p>
          <p className="font-display text-3xl font-bold text-primary mb-8">
            {formatTime(elapsedTime)}
          </p>
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Game screen
  const challenges = [
    <BunnyRotation key="bunny" />,
    <CipherWheel key="cipher" />,
    <PatternConnect key="pattern" />,
    <SequenceMemory key="sequence" />,
  ];

  const solvedCount = solvedChallenges.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌼</span>
            <h1 className="font-display text-xl font-semibold text-foreground">The Spring Vault</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-body text-muted-foreground">
              {solvedCount}/4 solved
            </span>
            <span className="font-body text-sm font-medium text-foreground tabular-nums">
              {formatTime(timer)}
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="px-6 py-4 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <ChallengeNav />
        </div>
      </div>

      {/* Challenge area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChallenge}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            {challenges[currentChallenge]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const EscapeRoom: React.FC = () => (
  <GameProvider>
    <GameInner />
  </GameProvider>
);

export default EscapeRoom;
