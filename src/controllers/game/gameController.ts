import WebSocket from 'ws';
import { createGame, getUserById } from '../../model';
import { AddToRoomDTO, GameResponse, MessageType } from '../../types';
import { sendMessage } from '../../utils';

export const handleCreateGame = (data: AddToRoomDTO) => {
  const game = createGame(data.indexRoom);

  if (game) {
    for (const player of game.players) {
      const user = getUserById(player.indexPlayer.toString());

      if (user) {
        const response: GameResponse = {
          idGame: game.id,
          idPlayers: player.indexPlayer,
        };
        const userWS = user.ws;

        if (userWS !== null) {
          sendCreateGameAnswer(userWS, response);
        }
      }
    }
  }
};

const sendCreateGameAnswer = (ws: WebSocket, dataRes: GameResponse) => {
  sendMessage(ws, {
    type: MessageType.CREATE_GAME,
    data: JSON.stringify(dataRes),
    id: 0,
  });
};
