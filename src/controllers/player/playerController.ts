import WebSocket from 'ws';
import {
  ErrorMessage,
  MessageType,
  Player,
  PlayerDTO,
  PlayerDataResponse,
} from '../../types';
import { createPlayer, getPlayer, getPlayerBySocket } from '../../model';
import { sendMessage } from '../../utils';

export const handlePlayerRegistration = (
  ws: WebSocket,
  data: PlayerDTO,
): void => {
  const player = getPlayer(data.name);
  if (player) {
    checkIsConnectionPlayer(ws, player, data.password);
  } else {
    const newPlayer = createPlayer(ws, data);
    sendSuccessAnswer(ws, newPlayer);
  }
};

export const handlePlayerDisconnect = (ws: WebSocket): void => {
  const player = getPlayerBySocket(ws);

  if (player) {
    player.ws = null;
  }
};

const checkIsConnectionPlayer = (
  client: WebSocket,
  player: Player,
  userPassword: string,
): void => {
  if (player.ws !== null) {
    return sendErrorAnswer(client, player, ErrorMessage.PLAYER_EXISTS);
  }

  if (player.password !== userPassword) {
    return sendErrorAnswer(client, player, ErrorMessage.INCORRECT_PASSWORD);
  }

  player.ws = client;
  sendSuccessAnswer(client, player);
};

const sendSuccessAnswer = (client: WebSocket, player: Player) => {
  const dataRes: PlayerDataResponse = {
    name: player.name,
    index: player.id,
    error: false,
    errorText: '',
  };

  sendMessage(client, {
    type: MessageType.REG,
    data: JSON.stringify(dataRes),
    id: 0,
  });
};

const sendErrorAnswer = (
  client: WebSocket,
  player: Player,
  errorMessage: string,
) => {
  const dataRes: PlayerDataResponse = {
    name: player.name,
    index: player.id,
    error: true,
    errorText: errorMessage,
  };
  sendMessage(client, {
    type: MessageType.REG,
    data: JSON.stringify(dataRes),
    id: 0,
  });
};
