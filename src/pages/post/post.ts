import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {NgForm} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {PostService} from "../../services/post.service";
import {AuthService} from "../../services/auth.service";
import {CreatePostPage} from "../create-post/create-post";
import {SearchPage} from "../search/search";
import {SharingFollowersListPage} from "../sharing-followers-list/sharing-followers-list";
import {UserService} from "../../services/user.service";
import {ToastService} from "../../services/toast.service";
import {HomePage} from "../home/home";

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
  providers: [PostService, UserService, ToastService]
})
export class PostPage {

  post;
  postId: number;
  comments = [];
  posts = [];
  currentUserId: number;
  isTick: boolean;
  comment: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpService: HttpService,
    public postService: PostService,
    public authService: AuthService,
    public modalCtrl: ModalController,
    public userService: UserService,
    public toastService: ToastService
  ) {
    this.post = navParams.get('post');
    this.postId = this.post.id_post;
    this.isTick = this.post.donate;
    this.comments = this.post.comments;
    this.currentUserId = Number(this.authService.getUserId());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  showPostAlert(postId, authorId) {
    let alert = this.alertCtrl.create({
      cssClass: 'alert-capabilities',
      buttons: [
        {
          text: 'Поделиться',
          cssClass: 'hidden',
          handler: () => {
            this.presentProfileModal(postId);
          }
        }
      ]

    });
    if (this.currentUserId === authorId) {
      alert.addButton({
        text: 'Удалить',
        handler: () => {
          this.postService.deletePost(postId)
            .subscribe(
              response => {
                console.log(response.json());
                this.navCtrl.setRoot(HomePage);
                this.toastService.showToast('Пост успешно удален!');
              },
              error => {
                console.log(error);
              }
            );
        }
      });
    } else {
      alert.addButton({
        text: 'Пожаловаться',
        handler: () => {
          this.presentComplaintPrompt(postId, authorId);
        }
      });
    }
    alert.present();
  }

  onCategoryPage(categoryId) {
    this.navCtrl.push(CategoryPage, {categoryId: categoryId});
  }

  concatTag(tag: string) {
    return tag + ' ';
  }

  onSetComment(form: NgForm) {
    console.log(form.value.comment);
    this.httpService.setComment(this.postId, form.value.comment)
      .subscribe(
        response => {
          console.log(response.json());
          this.comments.push(response.json().comment);
          form.reset();
        },
        error => {
          console.log('Error');
        }
      );
  }

  onAuthorPage(userId) {
    this.navCtrl.push(UserProfilePage, {userId: userId});
  }

  showTickAlert(postId: number, userId: number) {
    console.log(postId, userId);
    this.postService.getBalance()
      .subscribe(
        response => {
          let balance = response.json().balance;
          let prompt = this.alertCtrl.create({
            title: 'Тик',
            message: 'Количество тиков на Вашем счету ' + balance + '<p>Введите количество тиков</p>',
            inputs: [
              {
                name: 'tick',
                placeholder: 'Tick',
                type: 'number'
              },
            ],
            buttons: [
              {
                text: 'Отмена',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Сохранить',
                handler: data => {
                  if (data.tick <= balance && data.tick && Number(data.tick) !== 0) {
                    console.log('Saved clicked');
                    this.postService.setTick(postId, userId, data.tick)
                      .subscribe(
                        response => {
                          console.log(response.json());
                          let tickCount = response.json().amount_ticks;
                          this.post.tickCount = tickCount;
                          this.isTick = true;
                          console.log(this.post.tickCount);
                        }
                      );
                  } else {
                    return false;
                  }
                }
              }
            ]
          });
          prompt.present();
        }
      )
  }

  presentProfileModal(postId) {
    let profileModal = this.modalCtrl.create(SharingFollowersListPage, {postId: postId});
    profileModal.onDidDismiss(data => {
      console.log(data);
    });
    profileModal.present();
  }

  presentComplaintPrompt(postId, authorId) {
    let complaintReasons = [];
    let reasonId: number;
    this.userService.getComplaintReasons()
      .subscribe(
        response => {
          let complaints = response.json().complaints;
          for (let index in complaints) {
            let reason = complaints[index];
            console.log(reason);
            complaintReasons.push({
              id: reason.id,
              label: reason.description,
              type: 'radio',
              handler: () => {
                reasonId = reason.id;
                console.log(reasonId);
              }
            })
          }
          console.log(complaintReasons);
          let alert = this.alertCtrl.create({
            title: 'Пожаловаться',
            message: 'Укажите причину:',
            inputs: complaintReasons,
            buttons: [
              {
                text: 'Отмена',
                role: 'cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Подтвердить',
                handler: data => {
                  console.log(data);
                  this.userService.setComplaintReason(postId, authorId, reasonId)
                    .subscribe(
                      response => {
                        console.log(response);
                        this.toastService.showToast('Вы пожаловались на пользователя!');
                      },
                      error => {
                        console.log(error);
                      }
                    )
                }
              }
            ]
          });
          alert.present();
        },
        error =>{
          console.log(error);
        }
      );

  }

  onSearchPage(tag) {
    console.log(tag);
    this.navCtrl.push(SearchPage, {query: tag});
  }

}
