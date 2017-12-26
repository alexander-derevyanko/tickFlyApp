import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";
import {FollowersPage} from "../followers/followers";
import {FollowedPage} from "../followed/followed";
import {EditUserPage} from "../edit-user/edit-user";
import {ChangePasswordPage} from "../change-password/change-password";
import {CategoryPage} from "../category/category";
import {PostService} from "../../services/post.service";
import {CreatePostPage} from "../create-post/create-post";
import {SearchPage} from "../search/search";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
  providers: [UserService, PostService, LoaderService]
})
export class UserProfilePage {

  userId: number;
  posts = [];
  isPublic: boolean = true;
  isSubscribe: boolean = false;
  user;
  followersCount: number;
  pageId: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    public alertCtrl: AlertController,
    public postService: PostService,
    public loadService: LoaderService
  ) {
    this.userId = this.navParams.get('userId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  ngOnInit() {
    this.loadService.showLoader();
    this.userService.getProfile(this.userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.user = response.json().user;
          let postsList = response.json().posts;
          this.isPublic = response.json().public;
          this.isSubscribe = response.json().current_user_subscribe;
          this.followersCount = this.user.followers_count;
          for(let index in postsList){
            let post = postsList[index];
            this.posts.push({
              postId: post.id_post,
              title: post.title,
              categories: post.categories,
              description: post.description,
              tags: post.tags,
              tickCount: post.summ_ticks,
              date: post.format_date,
              media: post.media,
              isTick: post.donate
            });
          }
          this.loadService.hideLoader();
        },
        error => {
          console.log(error);
          this.loadService.hideLoader();
        }
      );
  }

  onFollowersPage(userId) {
    let followersList;
    this.userService.getFollowers(userId)
      .subscribe(
        response => {
          followersList = response.json().followers;
          this.navCtrl.push(FollowersPage, {followersList: followersList});
        },
        error => {
          console.log();
        }
      );
  }

  onFollowedPage(userId) {
    let followedList;
    this.userService.getFollowed(userId)
      .subscribe(
        response => {
          followedList = response.json().followed;
          this.navCtrl.push(FollowedPage, {followedList: followedList});
        },
        error => {
          console.log();
        }
      );
  }

  onToggleSubscribe(userId) {
    this.userService.toggleSubscribe(userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.followersCount = response.json().followers_count;
          this.isSubscribe = response.json().subscribe;
          console.log(this.followersCount);
        },
        error => {
          console.log('error');
        }
      )
  }

  onEditUserPage() {
    this.navCtrl.push(EditUserPage);
  }

  onChangePasswordPage() {
    this.navCtrl.push(ChangePasswordPage);
  }

  showAlertUserEdit() {
    let alert = this.alertCtrl.create({
      cssClass: 'alert-user-edit',
      buttons: [
        {
          text: 'Редактировать профиль',
          handler: () => {
            this.onEditUserPage();
          }
        },
        {
          text: 'Изменить пароль',
          handler: () => {
            this.onChangePasswordPage();
          }
        }
      ]
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.postService.getMorePostsOnProfile(this.userId, this.pageId).subscribe(
        response => {
          console.log(response.json());
          let postsList = response.json().posts;
          for(let index in postsList){
            let post = postsList[index];
            this.posts.push({
              postId: post.id_post,
              title: post.title,
              categories: post.categories,
              description: post.description,
              tags: post.tags,
              tickCount: post.summ_ticks,
              date: post.format_date,
              media: post.media,
              author: post.user
            });
          }
        },
        error => {
          console.log(error);
        }
      )

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
    this.pageId++;
    console.log(this.pageId);
  }
}
