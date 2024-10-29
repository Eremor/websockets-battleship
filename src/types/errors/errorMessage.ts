export enum ErrorMessage {
  USER_EXISTS = 'User with this name already exists',
  INCORRECT_PASSWORD = 'Incorrect password',
  UNEXPECTED_CREATE_ROOM_DATA = 'When creating a room, a value was received that was not equal to an empty string',
  UNEXPECTED_USER = 'Unexpected error: User with this socket not found',
  UNEXPECTED_ROOM = 'Unexpected error: Room not found',
  UNEXPECTED_GAME = 'Unexpected error: Game not found',
}
