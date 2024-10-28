export {
  handleUserRegistration,
  handleUserDisconnect,
} from './user/userController';

export {
  handleUpdateRooms,
  handleCreateRoom,
  handleAddUserToRoom,
} from './room/roomController';

export { handleUpdateWinners } from './winner/winnerController';

export {
  handleCreateGame,
  addShips,
  handleAttack,
} from './game/gameController';
