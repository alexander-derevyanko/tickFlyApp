import {User} from "./user";
import {Message} from "./message";


export class Chat {
  id?: number;
  title?: string;
  createdAt?: string;
  deletedAt?: string;
  updatedAt?: string;
  creatorId?: number;
  lastMessage?: string;
  unreadMessages?: number;
  members?: User[];
  messages?: Message[];
  avatar?: string;
  timeLastMassage?: string;
}

