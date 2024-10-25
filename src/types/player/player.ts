import WebSocket from 'ws';

export interface Player {
  id: string | number;
  ws: WebSocket | null;
  name: string;
  password: string;
}

export type PlayerDataResponse = {
  name: string;
  index: string | number;
  error: boolean;
  errorText: string;
};
