export enum ErrorMessage {
  PLAYER_EXISTS = 'Player with this name already exists',
  INCORRECT_PASSWORD = 'Incorrect password',
  UNEXPECTED_CREATE_ROOM_DATA = 'When creating a room, a value was received that was not equal to an empty string',
  UNEXPECTED_PLAYER = 'Unexpected error: User with this socket not found',
}
