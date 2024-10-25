import { randomUUID } from 'crypto';
import { Player, PlayerDTO } from '../../types';
import WebSocket from 'ws';

const players: Map<string, Player> = new Map();

export const getPlayers = (): Map<string, Player> => {
  return players;
};

export const getPlayer = (userName: string): Player | undefined => {
  return players.get(userName);
};

export const getPlayerBySocket = (ws: WebSocket): Player | undefined => {
  return Array.from(players.values()).find((player) => player.ws === ws);
};

export const createPlayer = (client: WebSocket, data: PlayerDTO): Player => {
  const { name, password } = data;
  const newPlayer: Player = {
    id: randomUUID(),
    ws: client,
    name,
    password,
  };

  players.set(name, newPlayer);

  return newPlayer;
};

export const removePlayer = (userName: string): void => {
  players.delete(userName);
};
