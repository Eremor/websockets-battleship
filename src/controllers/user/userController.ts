import WebSocket, { WebSocketServer } from 'ws';
import {
  ErrorMessage,
  MessageType,
  User,
  UserDTO,
  UserDataResponse,
} from '../../types';
import { createUser, getUser, getUserBySocket } from '../../model';
import { sendMessage } from '../../utils';
import { handleUpdateRooms } from '../room/roomController';
import { handleUpdateWinners } from '../winner/winnerController';

export const handleUserRegistration = (
  wss: WebSocketServer,
  ws: WebSocket,
  data: UserDTO,
): void => {
  const user = getUser(data.name);

  if (user) {
    checkIsConnectionUser(ws, user, data.password);
  } else {
    const newUser = createUser(ws, data);
    sendSuccessAnswer(ws, newUser);
  }

  handleUpdateRooms(wss);
  handleUpdateWinners(wss, data.name);
};

export const handleUserDisconnect = (ws: WebSocket): void => {
  const user = getUserBySocket(ws);

  if (user) {
    user.ws = null;
  }
};

const checkIsConnectionUser = (
  client: WebSocket,
  user: User,
  userPassword: string,
): void => {
  if (user.ws !== null) {
    return sendErrorAnswer(client, user, ErrorMessage.USER_EXISTS);
  }

  if (user.password !== userPassword) {
    return sendErrorAnswer(client, user, ErrorMessage.INCORRECT_PASSWORD);
  }

  user.ws = client;
  sendSuccessAnswer(client, user);
};

const sendSuccessAnswer = (client: WebSocket, user: User) => {
  const dataRes: UserDataResponse = {
    name: user.name,
    index: user.id,
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
  user: User,
  errorMessage: string,
) => {
  const dataRes: UserDataResponse = {
    name: user.name,
    index: user.id,
    error: true,
    errorText: errorMessage,
  };
  sendMessage(client, {
    type: MessageType.REG,
    data: JSON.stringify(dataRes),
    id: 0,
  });
};
