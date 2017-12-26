import {Chat} from "../models/chat";

export const CHATS: Chat[] = [
  {
    id: 1,
    updatedAt: "2017-12-12 18:14:46",
    creatorId: 1,
    lastMessage: "Hello",
    unreadMessages: 2,
    members: [
      {nickname: "Bambo"},
      {nickname: "Lodos"},
      {nickname: "Merlin"}
    ],
  },
  {
    id: 1,
    updatedAt: "2017-12-12 18:14:46",
    creatorId: 1,
    lastMessage: "Greetings",
    unreadMessages: 2,
    members: [
      {nickname: "Valla"},
      {nickname: "Kriplin"},
      {nickname: "Masthav"}
    ],
  },
  {
    id: 1,
    updatedAt: "2017-12-12 18:14:46",
    creatorId: 1,
    lastMessage: "Bye",
    unreadMessages: 4,
    members: [
      {nickname: "Zuko"},
      {nickname: "Azula"},
      {nickname: "Azulon"}
    ],
  },
];
