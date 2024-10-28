import WebSocket, { WebSocketServer } from 'ws';
import { addToRoom, createRoom, getUserBySocket, getRooms } from '../../model';
import {
  AddToRoomDTO,
  CreateRoomDTO,
  ErrorMessage,
  MessageType,
  RoomDataResponse,
} from '../../types';
import { sendMessage } from '../../utils';
import { handleCreateGame } from '../game/gameController';

export const handleUpdateRooms = (wss: WebSocketServer) => {
  const rooms = getRooms();
  const appropriateRooms = rooms.filter((room) => room.users.length === 1);
  const response: RoomDataResponse = appropriateRooms.map((room) => ({
    roomId: room.id,
    roomUsers: room.users.map((user) => ({
      name: user.name,
      index: user.id,
    })),
  }));

  wss.clients.forEach((client) => {
    const user = getUserBySocket(client);

    if (!user) return;

    if (client.readyState === client.OPEN) {
      sendMessage(client, {
        type: MessageType.UPDATE_ROOM,
        data: JSON.stringify(response),
        id: 0,
      });
    }
  });
};

export const handleCreateRoom = (
  socket: WebSocket,
  data: CreateRoomDTO,
): void => {
  try {
    if (data !== '') {
      throw new Error(ErrorMessage.UNEXPECTED_CREATE_ROOM_DATA);
    }

    const user = getUserBySocket(socket);

    if (!user) {
      throw new Error(ErrorMessage.UNEXPECTED_USER);
    }

    createRoom(user);
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const handleAddUserToRoom = (
  wss: WebSocketServer,
  socket: WebSocket,
  data: AddToRoomDTO,
): void => {
  try {
    const user = getUserBySocket(socket);
    const { indexRoom } = data;

    if (!user) {
      throw new Error(ErrorMessage.UNEXPECTED_USER);
    }

    const room = addToRoom(indexRoom, user);
    if (room) {
      handleUpdateRooms(wss);
      handleCreateGame(data);
      console.log('create game');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};
