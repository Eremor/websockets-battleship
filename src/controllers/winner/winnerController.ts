import { WebSocketServer } from 'ws';
import {
  createWinner,
  getUserBySocket,
  getWinner,
  getWinners,
  updateWinner,
} from '../../model';
import { sendMessage } from '../../utils';
import { MessageType } from '../../types';

export const handleUpdateWinners = (
  wss: WebSocketServer,
  winnerName: string,
): void => {
  const winner = getWinner(winnerName);

  if (winner) {
    updateWinner(winnerName);
  } else {
    createWinner(winnerName);
  }

  const winners = getWinners().sort((a, b) => a.wins - b.wins);

  wss.clients.forEach((client) => {
    const user = getUserBySocket(client);

    if (!user) return;

    if (client.readyState === client.OPEN) {
      sendMessage(client, {
        type: MessageType.UPDATE_WINNERS,
        data: JSON.stringify(winners),
        id: 0,
      });
    }
  });
};
