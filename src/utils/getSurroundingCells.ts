import { Ship, ShipPosition } from '../types';

const startGameField = 0;
const endGameFiled = 9;

export const getSurroundingCells = (ship: Ship): ShipPosition[] => {
  const surroundingCells: ShipPosition[] = [];

  const { position, direction, length } = ship;
  const { x, y } = position;
  const shipDirection = direction ? 'vertical' : 'horizontal';

  const startX = shipDirection === 'horizontal' ? x - 1 : x;
  const endX = shipDirection === 'horizontal' ? x + length : x + 1;
  const startY = shipDirection === 'vertical' ? y - 1 : y;
  const endY = shipDirection === 'vertical' ? y + length : y + 1;

  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      if (
        i >= startGameField &&
        i <= endGameFiled &&
        j >= startGameField &&
        j <= endGameFiled
      ) {
        if (
          shipDirection === 'horizontal' &&
          (i < x || i >= x + length || j !== y)
        ) {
          surroundingCells.push({ x: i, y: j });
        } else if (
          shipDirection === 'vertical' &&
          (j < y || j >= y + length || i !== x)
        ) {
          surroundingCells.push({ x: i, y: j });
        }
      }
    }
  }

  return surroundingCells;
};
