import WebSocket from 'ws';

export interface User {
  id: string | number;
  ws: WebSocket | null;
  name: string;
  password: string;
}

export type UserDataResponse = {
  name: string;
  index: string | number;
  error: boolean;
  errorText: string;
};
