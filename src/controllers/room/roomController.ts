import { WebSocketServer } from 'ws';
import { getPlayerBySocket, getRooms } from '../../model';
import { MessageType, RoomDataResponse } from '../../types';
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
