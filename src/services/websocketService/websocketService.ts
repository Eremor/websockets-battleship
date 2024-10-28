import WebSocket, { WebSocketServer } from 'ws';
import { AddToRoomDTO, Message, MessageType, UserDTO } from '../../types';
import {
  handleAddUserToRoom,
  handleCreateRoom,
  handleUserDisconnect,
  handleUserRegistration,
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
          const reqUserData = JSON.parse(parsedMessage.data) as UserDTO;
          handleUserRegistration(ws, reqUserData);
          handleUpdateRooms(wss);
          handleUpdateWinners(wss);
          break;
        }
        case MessageType.CREATE_ROOM: {
          handleCreateRoom(ws, parsedMessage.data);
          handleUpdateRooms(wss);
          break;
        }
        case MessageType.ADD_USER_TO_ROOM: {
          const reqAddToRoomDTO = JSON.parse(
            parsedMessage.data,
          ) as AddToRoomDTO;
          handleAddUserToRoom(wss, ws, reqAddToRoomDTO);
          break;
        }

        default:
          console.error('Unknown command type');
      }
    });

    ws.on('close', () => {
      console.log(`User disconnect`);
      handleUserDisconnect(ws);
    });
  });
};
