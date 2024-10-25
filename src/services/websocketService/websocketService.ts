import WebSocket, { WebSocketServer } from 'ws';
import { CreateRoomDTO, Message, MessageType, PlayerDTO } from '../../types';
import {
  handleCreateRoom,
  handlePlayerDisconnect,
  handlePlayerRegistration,
  handleUpdateRooms,
  handleUpdateWinners,
} from '../../controllers';

export const websocketService = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New connection');

    ws.on('message', (message: string) => {
      const parsedMessage: Message = JSON.parse(message);
      console.log(`Command received: ${parsedMessage.type}`);

      switch (parsedMessage.type) {
        case MessageType.REG: {
          const reqPlayerData = JSON.parse(parsedMessage.data) as PlayerDTO;
          handlePlayerRegistration(ws, reqPlayerData);
          handleUpdateRooms(wss);
          handleUpdateWinners(wss);
          break;
        }
        case MessageType.CREATE_ROOM: {
          handleCreateRoom(ws, parsedMessage.data);
          handleUpdateRooms(wss);
          break;
        }

        default:
          console.error('Unknown command type');
      }
    });

    ws.on('close', () => {
      console.log(`User disconnect`);
      handlePlayerDisconnect(ws);
    });
  });
};
