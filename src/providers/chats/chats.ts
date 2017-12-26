import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {CHATS} from "../../mock/chats";
import {Chat} from "../../models/chat";

@Injectable()
export class ChatsProvider {

  constructor(public http: Http) {

  }

  public getChats(): Chat[] {
    return CHATS;
  }

}
