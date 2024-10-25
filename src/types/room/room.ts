import { Player } from '../player/player';

export interface Room {
  id: string;
  players: Player[];
}
