import {Component, Provider, ViewChild} from "@angular/core";
import {Content, IonicPage, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatService} from "../../services/chat.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";
import {User} from "../../models/user";
import {Message} from "../../models/message";
import {SocketService} from "../../services/socket.service";
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ChatService, LoaderService, HttpService],
})
export class ChatPage {
  chat: Chat;
  chatId: number;
  userId: number;
  interlocutor: User;
  messageListener;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService,
              public socketService: SocketService,
              public httpService: HttpService) {
    this.chat = new Chat();
    this.chat.messages = [];
    this.interlocutor = new User();
  }

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
    this.chatId = this.navParams.get("chatId");
    this.getChat();
    this.scrollToBottom();
  }

  destroyListeners() {
    this.messageListener.unsubscribe();
  }

  ionViewDidLeave() {
    console.log("Listeners destroyed");
    this.destroyListeners();
  }

  startListening() {
    console.log('startListening');
    this.messageListener = this.socketService.getMessages().subscribe(data => {
      // TODO: KEK LEL TOP TIER MEMES
      let messageData = data['data'];
      if (messageData['senderId'] == this.interlocutor.id && messageData['chatId'] == this.chatId) {
        let msg = new Message();
        msg.message = messageData['text'];
        msg.userId = messageData['senderId'];
        msg.messageType = "text";
        msg.createdAt = messageData['createdAt']
        this.chat.messages.push(msg);
        console.log('push to array');
        this.scrollToBottom();
      }
    });
    this.chat.messages = this.chat.messages.reverse();
    console.log(this.chat.messages);
    this.scrollToBottom();
  }


  getChat() {
    console.log('getChat');
    const lStorageKey = "chatMessages_" + this.chatId;
    if (localStorage.getItem(lStorageKey)) {
      this.chat.messages = JSON.parse(localStorage.getItem(lStorageKey));
    } else {
      this.loadService.showLoader();
    }

    this.chatService.getChat(this.chatId).subscribe(
      response => {
        this.chat.messages = response.json().messages.map(message => {
          message.userId = message.user_id;
          message.createdAt = message.format_time;
          message.messageType = message.message_type;

          // message.message = message.message;
          console.log(message.message_type);
          console.log(message.message);
          return message;
        });
        localStorage.setItem(lStorageKey, JSON.stringify(this.chat.messages));
        let interlocutor = response.json().members.filter(member => {
          return member.user.id_user != this.userId;
        })[0];

        this.interlocutor.id = interlocutor.user.id_user;
        this.interlocutor.avatar = interlocutor.user.avatar;
        this.interlocutor.firstName = interlocutor.user.first_name;
        this.interlocutor.lastName = interlocutor.user.last_name;
        this.interlocutor.nickname = interlocutor.user.nick_name;
        this.interlocutor.email = interlocutor.user.email;
        this.loadService.hideLoader();
        this.startListening();
        this.scrollToBottom();
      },
      error => {
        this.loadService.hideLoader();
      }
    )
    this.chat.messages = this.chat.messages.reverse();
    console.log(this.chat.messages);
  }


  sendMessage(form: NgForm) {
    console.log(form.value.message);

    let currentdate = new Date();
    let currentDatetime = currentdate.getHours() + ":" + (currentdate.getMinutes()<10?'0':'') + currentdate.getMinutes() ;
    console.log('datetime');
    console.log(currentDatetime);
    this.chatService.sendMessage(this.chatId, form.value.message)
      .subscribe(
        response => {
          this.socketService.emitChatMessage(form.value.message, this.chatId, this.userId, this.interlocutor.id, currentDatetime);
          this.chat.messages.push({
              userId: Number(this.userId),
              message: form.value.message,
              createdAt: currentDatetime,
              messageType: 'text'
            }
          );
          form.reset();
          this.scrollToBottom();
        },
        error => {
          console.log('Error');
        }
      );
  }


  onPostPage(postId) {
    this.loadService.showLoader();
    let post;
    this.httpService.getPost(postId)
      .subscribe(
        response => {
          post = response.json().post;
          console.log(post);
          this.navCtrl.push(PostPage, {post: post});
          this.loadService.hideLoader();
        },
        error => {
          console.log(error);
          this.loadService.hideLoader();
        }
      );
  }



  scrollToBottom() {
    console.log('scrooll to bottom');
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }
}
