export interface Player {
  id: string | number;
  name: string;
  password: string;
  wins: number;
}

export type PlayerDataResponse = {
  name: string;
  index: string | number;
  error: boolean;
  errorText: string;
};
