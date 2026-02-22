import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, Direction, Position } from '../types/game';
import { checkWallCollision, checkSelfCollision, checkFoodCollision } from '../utils/collisionDetection';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameLoop } from '../hooks/useGameLoop';
import GameOverScreen from './GameOverScreen';
import ScoreDisplay from './ScoreDisplay';

const GRID_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 80;

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    snake: {
      body: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ],
      direction: 'RIGHT'
    },
    food: { position: { x: 15, y: 10 } },
    score: 0,
    isGameOver: false,
    isPaused: false
  });

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const nextDirectionRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((): Position => {
    const snake = gameStateRef.current.snake.body;
    let newFood: Position;
    let isValidPosition = false;

    while (!isValidPosition) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };

      isValidPosition = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);

      if (isValidPosition) {
        return newFood;
      }
    }

    return { x: 0, y: 0 };
  }, []);

  const moveSnake = useCallback((): Position => {
    const currentHead = gameStateRef.current.snake.body[0];
    const direction = nextDirectionRef.current;
    let newHead: Position;

    switch (direction) {
      case 'UP':
        newHead = { x: currentHead.x, y: currentHead.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: currentHead.x, y: currentHead.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: currentHead.x - 1, y: currentHead.y };
        break;
      case 'RIGHT':
        newHead = { x: currentHead.x + 1, y: currentHead.y };
        break;
    }

    return newHead;
  }, []);

  const updateGame = useCallback(() => {
    if (gameStateRef.current.isGameOver || gameStateRef.current.isPaused) {
      return;
    }

    const newHead = moveSnake();

    // Check collisions
    if (checkWallCollision(newHead, GRID_SIZE) || checkSelfCollision(newHead, gameStateRef.current.snake.body)) {
      gameStateRef.current.isGameOver = true;
      setIsGameOver(true);
      return;
    }

    // Update snake body
    const newBody = [newHead, ...gameStateRef.current.snake.body];

    // Check food collision
    if (checkFoodCollision(newHead, gameStateRef.current.food.position)) {
      const newScore = gameStateRef.current.score + 1;
      gameStateRef.current.score = newScore;
      gameStateRef.current.food.position = generateFood();
      setScore(newScore);

      // Increase speed gradually
      const newSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - newScore * SPEED_INCREMENT);
      setSpeed(newSpeed);
    } else {
      newBody.pop();
    }

    gameStateRef.current.snake.body = newBody;
    gameStateRef.current.snake.direction = nextDirectionRef.current;
  }, [moveSnake, generateFood]);

  useGameLoop({
    onUpdate: updateGame,
    isRunning: !isGameOver && !isPaused,
    speed
  });

  const handleDirectionChange = useCallback((direction: Direction) => {
    nextDirectionRef.current = direction;
  }, []);

  const handlePause = useCallback(() => {
    gameStateRef.current.isPaused = !gameStateRef.current.isPaused;
    setIsPaused(prev => !prev);
  }, []);

  const handleRestart = useCallback(() => {
    gameStateRef.current = {
      snake: {
        body: [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 }
        ],
        direction: 'RIGHT'
      },
      food: { position: generateFood() },
      score: 0,
      isGameOver: false,
      isPaused: false
    };
    nextDirectionRef.current = 'RIGHT';
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  }, [generateFood]);

  useKeyboardControls({
    onDirectionChange: handleDirectionChange,
    onPause: handlePause,
    onRestart: handleRestart,
    isGameOver,
    isPaused
  });

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
        ctx.stroke();
      }

      // Draw snake
      gameStateRef.current.snake.body.forEach((segment, index) => {
        const isHead = index === 0;
        const gradient = ctx.createLinearGradient(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          (segment.x + 1) * CELL_SIZE,
          (segment.y + 1) * CELL_SIZE
        );

        if (isHead) {
          gradient.addColorStop(0, '#10b981');
          gradient.addColorStop(1, '#059669');
        } else {
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(1, '#4f46e5');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );

        // Add glow effect
        ctx.shadowBlur = isHead ? 15 : 10;
        ctx.shadowColor = isHead ? '#10b981' : '#6366f1';
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
        ctx.shadowBlur = 0;
      });

      // Draw food
      const food = gameStateRef.current.food.position;
      const foodGradient = ctx.createRadialGradient(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2
      );
      foodGradient.addColorStop(0, '#f59e0b');
      foodGradient.addColorStop(1, '#d97706');

      ctx.fillStyle = foodGradient;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f59e0b';
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const animationFrame = requestAnimationFrame(function loop() {
      render();
      requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative">
      <ScoreDisplay score={score} isPaused={isPaused} />
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border-2 border-game-border rounded-lg shadow-2xl"
          tabIndex={0}
        />
        {isGameOver && <GameOverScreen score={score} onRestart={handleRestart} />}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-game-accent mb-2">已暂停</h2>
              <p className="text-game-text-secondary">按空格键继续</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
