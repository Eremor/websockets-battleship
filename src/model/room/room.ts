import { randomUUID } from 'crypto';
import { Player, Room } from '../../types';

const rooms: Map<string, Room> = new Map();

export const getRooms = (): Room[] => {
  return Array.from(rooms.values());
};

export const getRoom = (roomId: string): Room | undefined => rooms.get(roomId);

export const createRoom = (player: Player): void => {
  const roomId = randomUUID();
  const newRoom: Room = {
    id: roomId,
    players: [player],
  };

  rooms.set(roomId, newRoom);
};

export const updateRoom = (roomId: string, player: Player): void => {
  const room = rooms.get(roomId);

  if (room && room.players.length < 2) {
    room.players.push(player);
  }
};

export const removeRoom = (roomId: string): void => {
  rooms.delete(roomId);
};
