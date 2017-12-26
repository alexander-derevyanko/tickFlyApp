import {User} from "./user";

export class Message {
  id?: number;
  chatId?: number;
  userId?: number;
  createdAt?: string;
  media?: string[];   // not sure if string but dunno
  message?: string;
  user?: User;
  messageType?: string;
  read?: boolean;
}

