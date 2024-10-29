import { Winner } from '../../types';

const winners: Map<string, Winner> = new Map();

export const getWinners = (): Winner[] => {
  return Array.from(winners.values());
};

export const getWinner = (name: string): Winner | undefined => {
  return winners.get(name);
};

export const createWinner = (name: string): void => {
  const newWinner: Winner = {
    name,
    wins: 0,
  };

  winners.set(name, newWinner);
};

export const updateWinner = (name: string): void => {
  const winner = winners.get(name);

  if (winner) {
    winner.wins += 1;
  }
};
