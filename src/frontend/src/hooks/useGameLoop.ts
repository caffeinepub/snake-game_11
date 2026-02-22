import { useEffect, useRef, useCallback } from 'react';

interface UseGameLoopProps {
  onUpdate: () => void;
  isRunning: boolean;
  speed: number;
}

export function useGameLoop({ onUpdate, isRunning, speed }: UseGameLoopProps) {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const accumulatorRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current;
        accumulatorRef.current += deltaTime;

        // Update game state at fixed intervals
        while (accumulatorRef.current >= speed) {
          onUpdate();
          accumulatorRef.current -= speed;
        }
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [onUpdate, speed]
  );

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = null;
      accumulatorRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
}
