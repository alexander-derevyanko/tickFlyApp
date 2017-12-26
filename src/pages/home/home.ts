import {Component} from '@angular/core';
import {AlertController, MenuController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {AuthService} from "../../services/auth.service";
import {PostService} from "../../services/post.service";
import {SocketService} from "../../services/socket.service";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService, AuthService, PostService, LoaderService]
})
export class HomePage {
  unreadMessages: number;

  constructor(public navCtrl: NavController,
              private httpService: HttpService,
              private alertCtrl: AlertController,
              private postService: PostService,
              public menu: MenuController,
              public socketService: SocketService,
              public authService: AuthService,
              public loadService: LoaderService) {
  }

  posts = [];
  pageId: number = 0;

  ngOnInit() {
    this.menu.swipeEnable(true);
    this.loadService.showLoader();
    this.httpService.getPosts().subscribe(
      response => {
        console.log(response.json());
        let postsList = response.json().posts;
        for (let index in postsList) {
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
            author: post.user,
            isTick: post.donate
          });
          console.log(post.donate);
        }
        this.loadService.hideLoader();
      },
      error => {
        console.log(error);
        this.loadService.hideLoader();
      }
    )
  }

  startListening() {
    this.socketService.getMessages().subscribe(data => {
      if (data['data']['targetUserId'] == this.authService.getUserId()) {
        this.unreadMessages += 1;
        localStorage.setItem("unreadMessages", String(this.unreadMessages));
      }
    })
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.postService.getMorePostsOnHome(this.pageId).subscribe(
        response => {
          console.log(response.json());
          let postsList = response.json().posts;
          for (let index in postsList) {
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
              author: post.user,
              isTick: post.donate
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
