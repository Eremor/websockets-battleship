import { Winner } from '../../types';

const winners: Map<string, Winner> = new Map();

export const getWinners = (): Winner[] => {
  return Array.from(winners.values());
};
