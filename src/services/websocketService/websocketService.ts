import WebSocket, { WebSocketServer } from 'ws';
import {
  AddShipsDTO,
  AddToRoomDTO,
  AttackDTO,
  Message,
  MessageType,
  RandomAttackDTO,
  UserDTO,
} from '../../types';
import {
  handleAddUserToRoom,
  handleCreateRoom,
  handleUserDisconnect,
  handleUserRegistration,
  handleUpdateRooms,
  addShips,
  handleAttack,
  handleRandomAttack,
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
          handleUserRegistration(wss, ws, reqUserData);
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
        case MessageType.ADD_SHIPS: {
          const reqAddShips = JSON.parse(parsedMessage.data) as AddShipsDTO;
          addShips(reqAddShips);
          break;
        }
        case MessageType.ATTACK: {
          const reqAttack = JSON.parse(parsedMessage.data) as AttackDTO;
          handleAttack(wss, reqAttack);
          break;
        }
        case MessageType.RANDOM_ATTACK: {
          const reqRandomAttack = JSON.parse(
            parsedMessage.data,
          ) as RandomAttackDTO;
          handleRandomAttack(wss, reqRandomAttack);
          break;
        }

        default:
          console.error('Unknown command type');
      }
    });

    ws.on('close', () => {
      console.log('User disconnect');
      handleUserDisconnect(wss, ws);
    });
  });
};
