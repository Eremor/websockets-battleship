import { Ship } from '../ship/ship';

export interface GameShipData extends Ship {
  hits: number;
}

export interface Player {
  indexPlayer: string | number;
  ships: GameShipData[];
}
