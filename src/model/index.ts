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
  createRoom,
  addToRoom,
  removeRoom,
} from './room/room';

export { getWinners } from './winner/winner';

export { createGame, getGame } from './game/game';
