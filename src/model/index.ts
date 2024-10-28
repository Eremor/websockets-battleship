export {
  getUsers,
  getUser,
  getUserBySocket,
  getUserById,
  createUser,
  removeUser,
} from './user/user';

export {
  getRooms,
  getRoom,
  getRoomByUsers,
  createRoom,
  addToRoom,
  removeRoom,
} from './room/room';

export {
  getWinners,
  getWinner,
  createWinner,
  updateWinner,
} from './winner/winner';

export { createGame, getGame, getGameByUserId, removeGame } from './game/game';
