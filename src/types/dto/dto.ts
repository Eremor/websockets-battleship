import { Ship } from '../ship/ship';

export type UserDTO = {
  name: string;
  password: string;
};

export type CreateRoomDTO = string;

export interface AddToRoomDTO {
  indexRoom: string;
}

export interface AddShipsDTO {
  gameId: string | number;
  ships: Ship[];
  indexPlayer: number | string;
}

export interface AttackDTO {
  gameId: string | number;
  x: number;
  y: number;
  indexPlayer: string | number;
}
