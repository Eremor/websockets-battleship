import { randomUUID } from 'crypto';
import { ErrorMessage, Player, Room } from '../../types';

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

export const addToRoom = (roomId: string, player: Player): Room | undefined => {
  const room = rooms.get(roomId);

  if (!room) {
    throw new Error(ErrorMessage.UNEXPECTED_ROOM);
  }

  const isOwner = !!room.players.filter((user) => user.id === player.id).length;

  if (!isOwner && room.players.length < 2) {
    room.players.push(player);
    return room;
  }
};

export const removeRoom = (roomId: string): void => {
  rooms.delete(roomId);
};
