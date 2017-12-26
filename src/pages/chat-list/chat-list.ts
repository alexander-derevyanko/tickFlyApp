import {Component} from "@angular/core";
import {IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatsProvider} from "../../providers/chats/chats";
import {ChatPage} from "../chat/chat";
import {ChatService} from "../../services/chat.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {ChatNewRecipientPage} from "../chat-new-recipient/chat-new-recipient";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
  providers: [ChatService, AuthService, LoaderService]
})

export class ChatListPage {
  chats: Chat[];
  isLoaded: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService,
              public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.chats = [];
  }

  loadChatsFromStorage() {
    if (localStorage.getItem("chats")) {
      this.chats = JSON.parse(localStorage.getItem("chats"));
      this.isLoaded = true;
    }
  }

  getChats() {
    // this.loadService.showLoader();
    this.loadChatsFromStorage();
    console.log('getChats');
    this.chatService.getChats().subscribe(
      response => {
        console.log('getChats subscribe');
        console.log("Conversations", JSON.parse(response.text()).conversation);
        this.chats = response.json()
          .conversation.map(conversation => {
            console.log('conversations');
            let chat = new Chat();
            chat.id = conversation.chat_id;
            chat.lastMessage = conversation.last_message.message;
            chat.timeLastMassage = conversation.last_message.format_time;
            chat.updatedAt = conversation.updated_at;
            chat.unreadMessages = conversation.unread_message;
            chat.members = conversation.members.map(member => {
              let user = new User();
              user.nickname = member.user.nick_name;
              user.avatar = member.user.avatar;
              return user;
            });
            chat.avatar = conversation.members.filter(member => {
              return member.user.id_user != this.authService.getUserId();
            })[0].user.avatar;
            chat.title = conversation.members.filter(member => {
              return member.user.id_user != this.authService.getUserId();
            })[0].user.nick_name;

            return chat;
          });
        console.log(response.json().conversation);
        this.isLoaded = true;
        localStorage.setItem("chats", JSON.stringify(this.chats));
        console.log("set chats from response");
        // this.loadService.hideLoader();
      },
      error => {
        console.log("Chats error:", error);
        this.loadService.hideLoader();
      }
    );
  }

  createChat(targetUserId) {
    this.chatService.createChat(targetUserId).subscribe(
      response => {
        console.log("Created chat:", response);

      },
      error => {
        console.log("Chat creation error:", error)
      }
    );
  }

  onChatPage(chatId) {
    this.navCtrl.push(ChatPage, {chatId: chatId});
  }

  onNewChatPage() {
    this.navCtrl.push(ChatNewRecipientPage);
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.getChats();
  }

}
