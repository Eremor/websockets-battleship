import WebSocket, { WebSocketServer } from 'ws';
import {
  addToRoom,
  createRoom,
  getPlayerBySocket,
  getRooms,
} from '../../model';
import {
  AddToRoomDTO,
  CreateRoomDTO,
  ErrorMessage,
  MessageType,
  RoomDataResponse,
} from '../../types';
import { sendMessage } from '../../utils';

export const handleUpdateRooms = (wss: WebSocketServer) => {
  const rooms = getRooms();
  const appropriateRooms = rooms.filter((room) => room.players.length === 1);
  const response: RoomDataResponse = appropriateRooms.map((room) => ({
    roomId: room.id,
    roomUsers: room.players.map((player) => ({
      name: player.name,
      index: player.id,
    })),
  }));

  wss.clients.forEach((client) => {
    const player = getPlayerBySocket(client);

    if (!player) return;

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

    const player = getPlayerBySocket(socket);

    if (!player) {
      throw new Error(ErrorMessage.UNEXPECTED_PLAYER);
    }

    createRoom(player);
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const handleAddPlayerToRoom = (
  wss: WebSocketServer,
  socket: WebSocket,
  data: AddToRoomDTO,
): void => {
  try {
    const player = getPlayerBySocket(socket);
    const { indexRoom } = data;

    if (!player) {
      throw new Error(ErrorMessage.UNEXPECTED_PLAYER);
    }

    const room = addToRoom(indexRoom, player);
    if (room) {
      handleUpdateRooms(wss);
      console.log('create game');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};
