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

export { getWinners } from './winner/winner';

export { createGame, getGame, removeGame } from './game/game';
