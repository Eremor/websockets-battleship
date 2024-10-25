import WebSocket from 'ws';
import { Message } from '../types';

export const sendMessage = (ws: WebSocket, message: Message): void => {
  ws.send(JSON.stringify(message));
};
