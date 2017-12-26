import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {HttpService} from "../services/http.service";
import {AuthService} from "../services/auth.service";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {CategoryListPage} from "../pages/category-list/category-list";
import {ShopPage} from "../pages/shop/shop";
import {SocketService} from "../services/socket.service";
import {ChatListPage} from "../pages/chat-list/chat-list";


@Component({
  templateUrl: 'app.html',
  providers: [HttpService, AuthService]
})

@Injectable()
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  logged: boolean = false;

  pages: Array<{ title: string, component: any }>;

  userId = this.authService.getUserId();

  newMessages: number = 0;

  messagesLabel: string;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private authService: AuthService,
              private socketService: SocketService) {
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Главная', component: HomePage},
      {title: 'Категории', component: CategoryListPage},
      {title: 'Магазин тиков', component: ShopPage}
    ];
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.socketService.connect();
      this.startListening();
    })
  }

  startListening() {
    this.socketService.getMessages().subscribe(data => {
      console.log(data);
      if (data['data']['targetUserId'] == this.authService.getUserId()) {
        this.newMessages += 1;
        localStorage.setItem("unreadMessages", String(this.newMessages));
      }
      // if (data['senderId'] == this.interlocutor.id && data['chatId'] == this.chatId) {
      //   let msg = new Message();
      //   msg.message = data['text'];
      //   msg.message_type = "text";
      //   this.chat.messages.push(msg);
      // }
    });
  }

  ngDoCheck() {
    this.logged = this.authService.isLogin();
    if (this.logged == true) {
      this.rootPage = HomePage;
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  onLoginPage() {
    this.nav.push(LoginPage);
  }

  onChatPage() {
    this.nav.push(ChatListPage);
  }

  onUserProfile() {
    this.nav.setRoot(UserProfilePage, {userId: this.authService.getUserId()});
  }

  logout() {
    this.authService.logout();
    this.onLoginPage();
  }
}
