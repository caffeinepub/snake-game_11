import { Position } from '../types/game';

export function checkWallCollision(head: Position, gridSize: number): boolean {
  return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
}

export function checkSelfCollision(head: Position, body: Position[]): boolean {
  // Check if head collides with any body segment (excluding the head itself)
  for (let i = 1; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

export function checkFoodCollision(head: Position, foodPosition: Position): boolean {
  return head.x === foodPosition.x && head.y === foodPosition.y;
}
