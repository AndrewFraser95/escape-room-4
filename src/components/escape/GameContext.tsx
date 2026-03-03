import React, { createContext, useContext, useState, useCallback } from "react";

interface GameState {
  currentChallenge: number;
  solvedChallenges: boolean[];
  gameComplete: boolean;
  startTime: number | null;
  elapsedTime: number;
}

interface GameContextType extends GameState {
  startGame: () => void;
  solveChallenge: (index: number) => void;
  goToChallenge: (index: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    currentChallenge: -1,
    solvedChallenges: [false, false, false, false],
    gameComplete: false,
    startTime: null,
    elapsedTime: 0,
  });

  const startGame = useCallback(() => {
    setState((s) => ({ ...s, currentChallenge: 0, startTime: Date.now() }));
  }, []);

  const solveChallenge = useCallback((index: number) => {
    setState((s) => {
      const solved = [...s.solvedChallenges];
      solved[index] = true;
      const allSolved = solved.every(Boolean);
      const nextChallenge = allSolved ? -1 : s.currentChallenge;
      return {
        ...s,
        solvedChallenges: solved,
        gameComplete: allSolved,
        currentChallenge: nextChallenge,
        elapsedTime: allSolved && s.startTime ? Date.now() - s.startTime : s.elapsedTime,
      };
    });
  }, []);

  const goToChallenge = useCallback((index: number) => {
    setState((s) => ({ ...s, currentChallenge: index }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      currentChallenge: -1,
      solvedChallenges: [false, false, false, false],
      gameComplete: false,
      startTime: null,
      elapsedTime: 0,
    });
  }, []);

  return (
    <GameContext.Provider value={{ ...state, startGame, solveChallenge, goToChallenge, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};
