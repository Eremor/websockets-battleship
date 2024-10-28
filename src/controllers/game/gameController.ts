import WebSocket from 'ws';
import { createGame, getGame, getUserById } from '../../model';
import {
  AddShipsDTO,
  AddToRoomDTO,
  AttackDTO,
  AttackResponse,
  AttackStatus,
  ErrorMessage,
  Game,
  GameResponse,
  MessageType,
  Ship,
  ShipPosition,
  StartGameResponse,
  TurnResponse,
} from '../../types';
import { getSurroundingCells, isHit, sendMessage } from '../../utils';

const SHIPS_AT_START_GAME = 10;

export const handleCreateGame = (data: AddToRoomDTO): void => {
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

export const addShips = (data: AddShipsDTO): void => {
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

    for (const ship of ships) {
      player.ships.push({
        ...ship,
        hits: 0,
      });
    }

    const isValidToStart = game.players.every(
      (player) => player.ships.length === SHIPS_AT_START_GAME,
    );

    if (isValidToStart) {
      console.log('start game');
      startGame(game);
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const startGame = (game: Game): void => {
  try {
    const [firstPlayer] = game.players;
    for (const player of game.players) {
      const user = getUserById(player.indexPlayer.toString());
      const responseShip: Ship[] = [];

      if (!user || user.ws === null) {
        throw new Error(ErrorMessage.UNEXPECTED_USER);
      }

      for (const ship of player.ships) {
        responseShip.push({
          direction: ship.direction,
          position: ship.position,
          length: ship.length,
          type: ship.type,
        });
      }

      sendStartGameAnswer(user.ws, {
        ships: responseShip,
        currentPlayerIndex: firstPlayer.indexPlayer,
      });
    }

    turn(game.id.toString(), game.players[0].indexPlayer.toString(), false);
  } catch (error) {
    console.error((error as Error).message);
  }
};

const sendStartGameAnswer = (ws: WebSocket, data: StartGameResponse): void => {
  sendMessage(ws, {
    type: MessageType.START_GAME,
    data: JSON.stringify(data),
    id: 0,
  });
};

export const handleAttack = (data: AttackDTO): void => {
  try {
    const { gameId, indexPlayer, x: attackX, y: attackY } = data;
    let attackStatus: AttackStatus = 'miss';
    let surroundingCells: ShipPosition[] = [];
    const game = getGame(gameId);

    if (!game) {
      throw new Error(ErrorMessage.UNEXPECTED_GAME);
    }

    const enemy = game.players.find(
      (player) => player.indexPlayer !== indexPlayer,
    );

    if (!enemy) {
      throw new Error(ErrorMessage.UNEXPECTED_USER);
    }

    for (const ship of enemy.ships) {
      if (isHit({ x: attackX, y: attackY }, ship)) {
        attackStatus = 'shot';
        ship.hits += 1;

        if (ship.length === ship.hits) {
          attackStatus = 'killed';
          surroundingCells = getSurroundingCells(ship);
        }
      }
    }

    for (const player of game.players) {
      const user = getUserById(player.indexPlayer.toString());

      if (!user || user.ws === null) {
        throw new Error(ErrorMessage.UNEXPECTED_USER);
      }

      sendAttackMessage(user.ws, {
        position: {
          x: attackX,
          y: attackY,
        },
        status: attackStatus,
        currentPlayer: indexPlayer,
      });
    }
    console.log(surroundingCells);
    // if (surroundingCells.length > 0) {
    //   surroundingCells.forEach((pos, index) => {
    //     if (index < surroundingCells.length - 1) {
    //       return handleAttack({
    //         gameId,
    //         x: pos.x,
    //         y: pos.y,
    //         indexPlayer,
    //       });
    //     }
    //   });
    // }

    const isTurn: boolean = attackStatus === 'miss' ? true : false;
    turn(gameId.toString(), indexPlayer.toString(), isTurn);
  } catch (error) {
    console.error((error as Error).message);
  }
};

const sendAttackMessage = (client: WebSocket, data: AttackResponse): void => {
  sendMessage(client, {
    type: MessageType.ATTACK,
    data: JSON.stringify(data),
    id: 0,
  });
};

const turn = (
  gameId: string,
  currentPlayerIndex: string,
  isTurn: boolean,
): void => {
  try {
    const game = getGame(gameId);
    let nextPlayerIndex = currentPlayerIndex;

    if (!game) {
      throw new Error(ErrorMessage.UNEXPECTED_GAME);
    }

    if (isTurn) {
      const nextPlayer = game.players.find(
        (player) => player.indexPlayer !== currentPlayerIndex,
      );
      if (!nextPlayer) {
        throw new Error(ErrorMessage.UNEXPECTED_USER);
      }

      nextPlayerIndex = nextPlayer.indexPlayer.toString();
    }

    const response: TurnResponse = {
      currentPlayer: nextPlayerIndex,
    };

    for (const player of game.players) {
      const user = getUserById(player.indexPlayer.toString());

      if (!user || user.ws === null) {
        throw new Error(ErrorMessage.UNEXPECTED_USER);
      }

      sendMessage(user.ws, {
        type: MessageType.TURN,
        data: JSON.stringify(response),
        id: 0,
      });
    }
    console.log(MessageType.TURN);
  } catch (error) {
    console.error((error as Error).message);
  }
};
