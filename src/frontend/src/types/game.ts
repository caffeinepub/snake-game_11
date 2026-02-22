export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Snake {
  body: Position[];
  direction: Direction;
}

export interface Food {
  position: Position;
}

export interface GameState {
  snake: Snake;
  food: Food;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
