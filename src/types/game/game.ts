import { Player } from '../player/player';
import { Ship, ShipPosition } from '../ship/ship';

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

export type AttackStatus = 'miss' | 'killed' | 'shot';

export interface AttackResponse {
  position: ShipPosition;
  currentPlayer: string | number;
  status: AttackStatus;
}

export interface TurnResponse {
  currentPlayer: string | number;
}

export interface FinishGameResponse {
  winPlayer: string | number;
}
