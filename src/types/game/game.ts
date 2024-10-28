import { Player } from '../player/player';
import { Ship } from '../ship/ship';

export interface Game {
  id: string | number;
  players: [Player, Player];
}

export interface GameResponse {
  idGame: string | number;
  idPlayer: string | number;
}

export interface StartGameResponse {
  ships: Ship[];
  currentPlayerIndex: string | number;
}
