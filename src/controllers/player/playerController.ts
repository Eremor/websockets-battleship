import WebSocket from 'ws';
import {
  ErrorMessage,
  MessageType,
  PlayerDataRequest,
  PlayerDataResponse,
} from '../../types';
import { createPlayer, getPlayer } from '../../model';
import { sendMessage } from '../../utils';

export const handlePlayerRegistration = (
  ws: WebSocket,
  data: PlayerDataRequest,
): void => {
  const player = getPlayer(data.name);
  if (player) {
    const dataRes: PlayerDataResponse = {
      name: player.name,
      index: player.id,
      error: true,
      errorText: ErrorMessage.PLAYER_EXISTS,
    };
    sendMessage(ws, {
      type: MessageType.REG,
      data: JSON.stringify(dataRes),
      id: 0,
    });
  } else {
    const newPlayer = createPlayer(data.name, data.password);
    const dataRes: PlayerDataResponse = {
      name: newPlayer.name,
      index: newPlayer.id,
      error: false,
      errorText: '',
    };

    sendMessage(ws, {
      type: MessageType.REG,
      data: JSON.stringify(dataRes),
      id: 0,
    });
  }
};
