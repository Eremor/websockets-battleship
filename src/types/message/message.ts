import { MessageDataRequest } from './messageDataRequest';

export interface MessageResponse {
  type: string;
  data: string;
  id: number;
}

export interface MessageRequest {
  type: string;
  data: MessageDataRequest;
  id: number;
}
