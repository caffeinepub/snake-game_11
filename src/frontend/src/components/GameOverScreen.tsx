import React from 'react';
import { Button } from './ui/button';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
      <div className="text-center px-8 py-10 bg-gradient-to-br from-game-primary to-game-secondary rounded-xl border-2 border-game-border shadow-2xl max-w-md">
        <h2 className="text-5xl font-bold text-game-accent mb-4 animate-pulse">游戏结束</h2>
        <div className="mb-6">
          <p className="text-game-text-secondary text-lg mb-2">最终得分</p>
          <p className="text-6xl font-bold text-white">{score}</p>
        </div>
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-game-accent hover:bg-game-accent/90 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
        >
          重新开始
        </Button>
        <p className="text-game-text-secondary text-sm mt-4">或按空格键 / 回车键</p>
      </div>
    </div>
  );
};

export default GameOverScreen;
