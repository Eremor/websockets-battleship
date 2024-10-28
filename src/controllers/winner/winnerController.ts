import { WebSocketServer } from 'ws';
import { getUserBySocket, getWinners } from '../../model';
import { sendMessage } from '../../utils';
import { MessageType } from '../../types';

export const handleUpdateWinners = (wss: WebSocketServer): void => {
  const winners = getWinners();

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
