import { Player } from '../player/player';

export interface GameResponse {
  idGame: string | number;
  idPlayer: string | number;
}

export interface Game {
  id: string | number;
  players: [Player, Player];
}
