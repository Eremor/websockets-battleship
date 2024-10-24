import WebSocket, { WebSocketServer } from 'ws';
import { Message, MessageType } from '../../types';

export const websocketService = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New connection established');

    ws.on('message', (message: string) => {
      const parsedMessage: Message = JSON.parse(message);
      console.log(`Command received: ${parsedMessage}`);

      switch (parsedMessage.type) {
        case MessageType.REG:
          break;

        default:
          console.error('Unknown command type');
      }
    });
  });
};
