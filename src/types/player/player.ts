import { Ship } from '../ship/ship';

export interface Player {
  indexPlayer: string | number;
  ships: Ship[];
}
