import WebSocket from 'ws';
import { MessageResponse } from '../types';

export const sendMessage = (ws: WebSocket, message: MessageResponse): void => {
  ws.send(JSON.stringify(message));
};
