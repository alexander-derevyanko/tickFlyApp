import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {SearchPage} from "../search/search";
import {CreatePostPage} from "../create-post/create-post";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [PostService, LoaderService]
})
export class CategoryPage {

  categoryId: number = 0;
  category;
  posts = [];
  pageId: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private postService: PostService,
    public loadService: LoaderService
  ) {
    this.categoryId = this.navParams.get('categoryId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  ngOnInit() {
    this.loadService.showLoader();
    this.httpService.getCategory(this.categoryId)
      .subscribe(
        response => {
          console.log(response.json());
          this.category = response.json().category;
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
              author: post.user,
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

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.postService.getMorePostsOnCategory(this.categoryId, this.pageId).subscribe(
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
