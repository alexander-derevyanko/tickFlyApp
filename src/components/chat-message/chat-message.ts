import {Component, Input} from '@angular/core';
import {Message} from "../../models/message";
import {PostService} from "../../services/post.service";

@Component({
  selector: 'chat-message',
  templateUrl: 'chat-message.html',
})
export class ChatMessageComponent {
  @Input() message: Message;

  constructor() {
  }
}
