import { useEffect, useRef } from 'react';
import { Direction } from '../types/game';

interface UseKeyboardControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onRestart: () => void;
  isGameOver: boolean;
  isPaused: boolean;
}

export function useKeyboardControls({
  onDirectionChange,
  onPause,
  onRestart,
  isGameOver,
  isPaused
}: UseKeyboardControlsProps) {
  const currentDirectionRef = useRef<Direction>('RIGHT');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          onRestart();
        }
        return;
      }

      if (e.key === ' ') {
        onPause();
        return;
      }

      if (isPaused) {
        return;
      }

      let newDirection: Direction | null = null;

      switch (e.key) {
        case 'ArrowUp':
          if (currentDirectionRef.current !== 'DOWN') {
            newDirection = 'UP';
          }
          break;
        case 'ArrowDown':
          if (currentDirectionRef.current !== 'UP') {
            newDirection = 'DOWN';
          }
          break;
        case 'ArrowLeft':
          if (currentDirectionRef.current !== 'RIGHT') {
            newDirection = 'LEFT';
          }
          break;
        case 'ArrowRight':
          if (currentDirectionRef.current !== 'LEFT') {
            newDirection = 'RIGHT';
          }
          break;
      }

      if (newDirection) {
        currentDirectionRef.current = newDirection;
        onDirectionChange(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onDirectionChange, onPause, onRestart, isGameOver, isPaused]);

  return currentDirectionRef;
}
