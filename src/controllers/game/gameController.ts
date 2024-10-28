import WebSocket from 'ws';
import { createGame, getGame, getUserById } from '../../model';
import {
  AddToRoomDTO,
  ErrorMessage,
  GameResponse,
  MessageType,
} from '../../types';
import { sendMessage } from '../../utils';
import { AddShipsDTO } from '../../types/dto/dto';

const SHIPS_AT_START_GAME = 10;

export const handleCreateGame = (data: AddToRoomDTO) => {
  try {
    const game = createGame(data.indexRoom);

    if (!game) {
      throw new Error(ErrorMessage.UNEXPECTED_GAME);
    }

    for (const player of game.players) {
      const user = getUserById(player.indexPlayer.toString());

      if (!user || user.ws === null) {
        throw new Error(ErrorMessage.UNEXPECTED_USER);
      }

      const response: GameResponse = {
        idGame: game.id,
        idPlayer: player.indexPlayer,
      };

      sendCreateGameAnswer(user.ws, response);
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const sendCreateGameAnswer = (ws: WebSocket, dataRes: GameResponse) => {
  sendMessage(ws, {
    type: MessageType.CREATE_GAME,
    data: JSON.stringify(dataRes),
    id: 0,
  });
};

export const addShips = (data: AddShipsDTO) => {
  try {
    const { gameId, indexPlayer, ships } = data;

    const game = getGame(gameId);

    if (!game) {
      throw new Error(ErrorMessage.UNEXPECTED_GAME);
    }

    const player = game.players.find(
      (player) => player.indexPlayer === indexPlayer,
    );

    if (!player) {
      throw new Error(ErrorMessage.UNEXPECTED_USER);
    }

    player.ships = ships;

    const isValidToStart = game.players.every(
      (player) => player.ships.length === SHIPS_AT_START_GAME,
    );

    if (isValidToStart) {
      console.log('start game');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};
