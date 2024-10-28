import { User } from '../user/user';

export interface Room {
  id: string;
  users: User[];
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
