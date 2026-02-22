import React from 'react';

interface ScoreDisplayProps {
  score: number;
  isPaused: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isPaused }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-8">
        <div className="bg-gradient-to-br from-game-primary to-game-secondary px-6 py-3 rounded-lg shadow-lg border border-game-border">
          <div className="text-sm text-game-text-secondary font-medium mb-1">得分</div>
          <div className="text-3xl font-bold text-game-accent">{score}</div>
        </div>
        {isPaused && (
          <div className="px-4 py-2 bg-game-accent/20 border border-game-accent rounded-lg">
            <span className="text-game-accent font-semibold">已暂停</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
