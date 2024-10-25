import { Player } from '../player/player';

export interface Room {
  id: string;
  players: Player[];
}

interface RoomUser {
  name: string;
  index: number | string;
}

export interface RoomData {
  roomId: number | string;
  roomUsers: RoomUser[];
}

export type RoomDataResponse = RoomData[] | [];
