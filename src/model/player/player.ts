import { randomUUID } from 'crypto';
import { Player } from '../../types';

const players: Map<string, Player> = new Map();

export const getPlayers = (): Map<string, Player> => {
  return players;
};

export const getPlayer = (name: string): Player | undefined =>
  players.get(name);

export const createPlayer = (name: string, password: string): Player => {
  const newPlayer: Player = {
    id: randomUUID(),
    name,
    password,
    wins: 0,
  };

  players.set(name, newPlayer);

  return newPlayer;
};

export const updatePlayer = (name: string): void => {
  const player = players.get(name);

  if (player) {
    player.wins += 1;
  }
};

export const removePlayer = (name: string): void => {
  players.delete(name);
};
