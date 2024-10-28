import WebSocket, { WebSocketServer } from 'ws';
import {
  createGame,
  getGame,
  getRoomByUsers,
  getUserById,
  removeGame,
  removeRoom,
} from '../../model';
import {
  AddShipsDTO,
  AddToRoomDTO,
  AttackDTO,
  AttackResponse,
  AttackStatus,
  ErrorMessage,
  FinishGameResponse,
  Game,
  GameResponse,
  MessageType,
  RandomAttackDTO,
  Ship,
  ShipPosition,
  StartGameResponse,
  TurnResponse,
} from '../../types';
import { getSurroundingCells, isHit, sendMessage } from '../../utils';
import { GameShipData } from '../../types/player/player';
import { handleUpdateWinners } from '../winner/winnerController';

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

export const handleAttack = (wss: WebSocketServer, data: AttackDTO): void => {
  try {
    const { gameId, indexPlayer, x: attackX, y: attackY } = data;
    let attackStatus: AttackStatus = 'miss';
    let surroundingCells: ShipPosition[] = [];
    const attackPosition = {
      x: attackX,
      y: attackY,
    };
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
      if (isHit(attackPosition, ship)) {
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

      if (attackStatus === 'killed') {
        surroundingCells.forEach((value) => {
          sendAttackMessage(user.ws!, {
            position: {
              x: value.x,
              y: value.y,
            },
            status: 'miss',
            currentPlayer: indexPlayer,
          });

          console.log(MessageType.ATTACK);
          turn(gameId.toString(), indexPlayer.toString(), false);
        });
        surroundingCells = [];
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

    console.log(MessageType.ATTACK);
    const isTurn: boolean = attackStatus === 'miss' ? true : false;
    turn(gameId.toString(), indexPlayer.toString(), isTurn);

    if (checkFinish(enemy.ships)) {
      return handleFinishGame(wss, game, indexPlayer.toString());
    }
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

export const handleRandomAttack = (
  wss: WebSocketServer,
  data: RandomAttackDTO,
): void => {
  const randomAttackPositionX = Math.floor(Math.random() * 10);
  const randomAttackPositionY = Math.floor(Math.random() * 10);
  const { gameId, indexPlayer } = data;
  const dataForAttack: AttackDTO = {
    gameId,
    indexPlayer,
    x: randomAttackPositionX,
    y: randomAttackPositionY,
  };

  handleAttack(wss, dataForAttack);
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

const checkFinish = (enemyShips: GameShipData[]): boolean => {
  return enemyShips.every((ship) => ship.hits === ship.length);
};

export const handleFinishGame = (
  wss: WebSocketServer,
  game: Game,
  winPlayer: string,
): void => {
  try {
    for (const player of game.players) {
      const user = getUserById(player.indexPlayer.toString());

      if (!user || user.ws === null) {
        throw new Error(ErrorMessage.UNEXPECTED_USER);
      }

      const response: FinishGameResponse = {
        winPlayer,
      };

      sendMessage(user.ws, {
        type: MessageType.FINISH,
        data: JSON.stringify(response),
        id: 0,
      });
    }

    console.log(MessageType.FINISH);

    const winner = getUserById(winPlayer);

    if (winner) {
      handleUpdateWinners(wss, winner.name);
    }
    const [firstPlayer, secondPlayer] = game.players;

    const room = getRoomByUsers(
      firstPlayer.indexPlayer.toString(),
      secondPlayer.indexPlayer.toString(),
    );

    if (!room) {
      throw new Error(ErrorMessage.UNEXPECTED_ROOM);
    }

    removeGame(room.id);
    removeRoom(room.id);
  } catch (error) {
    console.error((error as Error).message);
  }
};
