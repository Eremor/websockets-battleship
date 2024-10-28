import { randomUUID } from 'crypto';
import { ErrorMessage, User, Room } from '../../types';

const rooms: Map<string, Room> = new Map();

export const getRooms = (): Room[] => {
  return Array.from(rooms.values());
};

export const getRoom = (roomId: string): Room | undefined => rooms.get(roomId);

export const createRoom = (user: User): void => {
  const roomId = randomUUID();
  const newRoom: Room = {
    id: roomId,
    users: [user],
  };

  rooms.set(roomId, newRoom);
};

export const addToRoom = (roomId: string, user: User): Room | undefined => {
  const room = rooms.get(roomId);

  if (!room) {
    throw new Error(ErrorMessage.UNEXPECTED_ROOM);
  }

  const isOwner = !!room.users.filter((player) => player.id === user.id).length;

  if (!isOwner && room.users.length < 2) {
    room.users.push(user);
    return room;
  }
};

export const removeRoom = (roomId: string): void => {
  rooms.delete(roomId);
};
