import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {PostPage} from "../pages/post/post";
import {HttpModule} from "@angular/http";
import {HttpService} from "../services/http.service";
import {FormsModule} from "@angular/forms";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {FollowersPage} from "../pages/followers/followers";
import {FollowedPage} from "../pages/followed/followed";
import {EditUserPage} from "../pages/edit-user/edit-user";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Camera} from "@ionic-native/camera";
import {CategoryListPage} from "../pages/category-list/category-list";
import {CategoryPage} from "../pages/category/category";
import {CreatePostPage} from "../pages/create-post/create-post";
import {GooglePlus} from "@ionic-native/google-plus";
import {ComponentsModule} from "../components/components.module";
import {CategoryPageModule} from "../pages/category/category.module";
import {CategoryListPageModule} from "../pages/category-list/category-list.module";
import {ChangePasswordPageModule} from "../pages/change-password/change-password.module";
import {CreatePostPageModule} from "../pages/create-post/create-post.module";
import {EditUserPageModule} from "../pages/edit-user/edit-user.module";
import {FollowedPageModule} from "../pages/followed/followed.module";
import {FollowersPageModule} from "../pages/followers/followers.module";
import {LoginPageModule} from "../pages/login/login.module";
import {PostPageModule} from "../pages/post/post.module";
import {RegisterPageModule} from "../pages/register/register.module";
import {UserProfilePageModule} from "../pages/user-profile/user-profile.module";
import {SearchPageModule} from "../pages/search/search.module";
import {SharingFollowersListPageModule} from "../pages/sharing-followers-list/sharing-followers-list.module";
import {ChatsProvider} from "../providers/chats/chats";
import {ChatListPage} from "../pages/chat-list/chat-list";
import {ChatListPageModule} from "../pages/chat-list/chat-list.module";
import {ChatPageModule} from "../pages/chat/chat.module";
import {ChatPage} from "../pages/chat/chat";
import {ChatNewRecipientPage} from "../pages/chat-new-recipient/chat-new-recipient";
import {ChatNewRecipientPageModule} from "../pages/chat-new-recipient/chat-new-recipient.module";
import {ShopPageModule} from "../pages/shop/shop.module";
import {ShopPage} from "../pages/shop/shop";
import {Stripe} from "@ionic-native/stripe";
import {SocketIoConfig, SocketIoModule} from "ng-socket-io";
import {SocketService} from "../services/socket.service";

const config: SocketIoConfig = {url: "http://ec2-54-186-176-148.us-west-2.compute.amazonaws.com:3001/", options: {}};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // LoginPage,
    // RegisterPage,
    // PostPage,
  ],
  imports: [
    BrowserModule,
    CategoryPageModule,
    CategoryListPageModule,
    ChangePasswordPageModule,
    CreatePostPageModule,
    EditUserPageModule,
    FollowedPageModule,
    RegisterPageModule,
    FollowersPageModule,
    PostPageModule,
    ComponentsModule,
    LoginPageModule,
    LoginPageModule,
    PostPageModule,
    RegisterPageModule,
    UserProfilePageModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),

    HttpModule,
    FormsModule,
    SearchPageModule,
    SharingFollowersListPageModule,
    ChatListPageModule,
    ChatPageModule,
    ChatNewRecipientPageModule,
    ShopPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    PostPage,
    UserProfilePage,
    FollowersPage,
    FollowedPage,
    EditUserPage,
    ChangePasswordPage,
    CategoryListPage,
    CategoryPage,
    CreatePostPage,
    ChatListPage,
    ChatPage,
    ChatNewRecipientPage,
    ShopPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpService,
    GooglePlus,
    File,
    Transfer,
    Camera,
    FilePath,
    ChatsProvider,
    SocketService,
    Stripe
  ]
})
export class AppModule {
}
