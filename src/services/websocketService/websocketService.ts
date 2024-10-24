import WebSocket, { WebSocketServer } from 'ws';
import { MessageRequest, MessageType } from '../../types';
import { handlePlayerRegistration } from '../../controllers';

export const websocketService = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New connection');

    ws.on('message', (message: string) => {
      const parsedMessage: MessageRequest = JSON.parse(message);
      console.log(`Command received: ${parsedMessage.type}`);

      switch (parsedMessage.type) {
        case MessageType.REG:
          handlePlayerRegistration(ws, parsedMessage.data);
          break;

        default:
          console.error('Unknown command type');
      }
    });
  });
};
