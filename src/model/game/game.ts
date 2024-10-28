import { ErrorMessage, Game } from '../../types';
import { getRoom } from '../room/room';

const games: Map<string, Game> = new Map();

export const getGame = (gameId: string | number): Game | undefined => {
  return games.get(gameId.toString());
};

export const createGame = (indexRoom: string | number): Game | undefined => {
  try {
    const roomId = indexRoom.toString();
    const room = getRoom(roomId);

    if (!room) {
      throw new Error(ErrorMessage.UNEXPECTED_ROOM);
    }

    const [firstPlayer, secondPlayer] = room.users;

    const newGame: Game = {
      id: indexRoom,
      players: [
        {
          indexPlayer: firstPlayer.id,
          ships: [],
        },
        {
          indexPlayer: secondPlayer.id,
          ships: [],
        },
      ],
    };

    games.set(roomId, newGame);

    return newGame;
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const removeGame = (roomId: string): void => {
  games.delete(roomId);
};
