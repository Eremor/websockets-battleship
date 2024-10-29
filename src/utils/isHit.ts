import { Ship, ShipPosition } from '../types';

export const isHit = (shot: ShipPosition, ship: Ship): boolean => {
  const { x: shotX, y: shotY } = shot;
  const { position, direction, length } = ship;
  const { x: shipX, y: shipY } = position;
  const shipDirection = direction ? 'vertical' : 'horizontal';
  let isHitToShip = false;

  if (shipDirection === 'horizontal') {
    isHitToShip = shotY === shipY && shotX >= shipX && shotX < shipX + length;
  } else {
    isHitToShip = shotX === shipX && shotY >= shipY && shotY < shipY + length;
  }

  return isHitToShip;
};
