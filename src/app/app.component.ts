import { Component, ViewChild, Injectable} from '@angular/core';
import {AlertController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import {RegisterPage} from "../pages/register/register";
import {PostPage} from "../pages/post/post";
import {HttpService} from "../services/http.service";
import {AuthService} from "../services/auth.service";
import {UserPrivatePage} from "../pages/user-private/user-private";

@Component({
  templateUrl: 'app.html',
  providers: [HttpService, AuthService]
})

@Injectable()
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  logged: boolean = false;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private authService: AuthService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'User', component: UserPrivatePage },
      { title: 'List', component: ListPage },
      { title: 'Login', component: LoginPage },
      { title: 'Register', component: RegisterPage },
      { title: 'Post', component: PostPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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

  logout() {
    this.authService.logout();
    this.onLoginPage();
  }
}
