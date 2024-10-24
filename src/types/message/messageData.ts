type PlayerData = {
  name: string;
  password: string;
};

type PlayerErrorData = {
  name: string;
  index: string | number;
  error: boolean;
  errorText: string;
};

export type MessageData = PlayerData | PlayerErrorData;
