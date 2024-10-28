import { randomUUID } from 'crypto';
import { User, UserDTO } from '../../types';
import WebSocket from 'ws';

const users: Map<string, User> = new Map();

export const getUsers = (): Map<string, User> => {
  return users;
};

export const getUser = (userName: string): User | undefined => {
  return users.get(userName);
};

export const getUserBySocket = (ws: WebSocket): User | undefined => {
  return Array.from(users.values()).find((user) => user.ws === ws);
};

export const getUserById = (id: string): User | undefined => {
  return Array.from(users.values()).find((user) => user.id === id);
};

export const createUser = (client: WebSocket, data: UserDTO): User => {
  const { name, password } = data;
  const newUser: User = {
    id: randomUUID(),
    ws: client,
    name,
    password,
  };

  users.set(name, newUser);

  return newUser;
};

export const removeUser = (userName: string): void => {
  users.delete(userName);
};
