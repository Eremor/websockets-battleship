import { MessageData } from './messageData';

export interface Message {
  type: string;
  data: MessageData;
  id: number;
}
