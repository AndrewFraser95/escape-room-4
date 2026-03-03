import React, { useState, useCallback, useRef, useEffect } from "react";
import { useGame } from "./GameContext";
import { motion, AnimatePresence } from "framer-motion";

const EGGS = [
  { id: 0, emoji: "🌷", label: "Tulip", color: "bg-spring-coral" },
  { id: 1, emoji: "🐣", label: "Chick", color: "bg-spring-honey" },
  { id: 2, emoji: "🌿", label: "Leaf", color: "bg-spring-sage" },
  { id: 3, emoji: "🦋", label: "Butterfly", color: "bg-spring-mint" },
];

const SEQUENCE_LENGTH = 5;

const SequenceMemory: React.FC = () => {
  const { solveChallenge, solvedChallenges } = useGame();
  const solved = solvedChallenges[3];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "showing" | "input" | "error">("idle");
  const [highlightedEgg, setHighlightedEgg] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const generateSequence = useCallback(() => {
    const seq: number[] = [];
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      seq.push(Math.floor(Math.random() * EGGS.length));
    }
    return seq;
  }, []);

  const showSequence = useCallback((seq: number[], upToIndex: number) => {
    setPhase("showing");
    clearTimeouts();

    for (let i = 0; i <= upToIndex; i++) {
      const showTimeout = setTimeout(() => {
        setHighlightedEgg(seq[i]);
      }, i * 700);
      const hideTimeout = setTimeout(() => {
        setHighlightedEgg(null);
      }, i * 700 + 500);
      timeoutRef.current.push(showTimeout, hideTimeout);
    }

    const endTimeout = setTimeout(() => {
      setPhase("input");
    }, (upToIndex + 1) * 700 + 200);
    timeoutRef.current.push(endTimeout);
  }, []);

  const startGame = () => {
    const seq = generateSequence();
    setSequence(seq);
    setRound(1);
    setPlayerInput([]);
    showSequence(seq, 0);
  };

  const handleEggClick = (eggId: number) => {
    if (phase !== "input" || solved) return;

    // Flash the egg
    setHighlightedEgg(eggId);
    setTimeout(() => setHighlightedEgg(null), 200);

    const newInput = [...playerInput, eggId];
    setPlayerInput(newInput);

    // Check each input as it comes
    const currentIndex = newInput.length - 1;
    if (newInput[currentIndex] !== sequence[currentIndex]) {
      // Wrong!
      setPhase("error");
      setTimeout(() => {
        setRound(0);
        setPlayerInput([]);
        setPhase("idle");
      }, 1200);
      return;
    }

    // If we've completed the current round
    if (newInput.length === round) {
      if (round === SEQUENCE_LENGTH) {
        // All rounds complete!
        solveChallenge(3);
        setPhase("idle");
      } else {
        // Next round
        const nextRound = round + 1;
        setRound(nextRound);
        setPlayerInput([]);
        setTimeout(() => {
          showSequence(sequence, nextRound - 1);
        }, 600);
      }
    }
  };

  useEffect(() => {
    return clearTimeouts;
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-md">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Spring Melody
        </h2>
        <p className="text-muted-foreground font-body">
          Watch the sequence of spring symbols, then repeat it from memory. 
          Each round adds one more to remember.
        </p>
      </div>

      <div className="glass-card challenge-glow rounded-xl p-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {EGGS.map((egg) => (
            <motion.button
              key={egg.id}
              onClick={() => handleEggClick(egg.id)}
              whileTap={phase === "input" ? { scale: 0.9 } : {}}
              className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                highlightedEgg === egg.id
                  ? egg.color + " shadow-lg scale-110"
                  : "bg-muted hover:bg-card"
              } ${phase !== "input" ? "cursor-default" : "cursor-pointer"}`}
              disabled={phase !== "input"}
            >
              <span className="text-3xl">{egg.emoji}</span>
              <span className="text-xs font-body text-muted-foreground">{egg.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          {phase === "idle" && !solved && (
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity"
            >
              {round === 0 ? "Start" : "Try Again"}
            </button>
          )}
          {phase === "showing" && (
            <p className="text-muted-foreground font-body animate-pulse-soft">Watch carefully...</p>
          )}
          {phase === "input" && (
            <p className="text-foreground font-body">
              Your turn! ({playerInput.length}/{round})
            </p>
          )}
          {phase === "error" && (
            <p className="text-destructive font-body font-medium">Wrong sequence! Try again.</p>
          )}
        </div>

        {round > 0 && phase !== "idle" && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: SEQUENCE_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < round ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {solved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-display text-xl font-semibold"
        >
          🎵 The spring melody is complete!
        </motion.div>
      )}
    </div>
  );
};

export default SequenceMemory;
