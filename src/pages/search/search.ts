import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {SearchService} from "../../services/search.service";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [PostService, SearchService]
})
export class SearchPage {

  posts = [];
  pageNumber: number = 0;
  inputSearch: string;
  section: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public searchService: SearchService
  ) {
    this.inputSearch = this.navParams.get('query');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  ngOnInit() {
    let inputQuery: string = this.inputSearch;
    this.posts = [];
    this.pageNumber = 0;
    if(inputQuery != undefined) {
      if (inputQuery.charAt(0) == '#') {
        this.section = 'tags';
        inputQuery = inputQuery.slice(1);
      } else {
        this.section = 'posts';
      }
      console.log(inputQuery);
      console.log(this.section);
      this.getSearchResults(this.section, inputQuery);
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let inputQuery: string = this.inputSearch;
    if(inputQuery.charAt(0) == '#') {
      this.section = 'tags';
      inputQuery = inputQuery.slice(1);
    } else {
      this.section = 'posts';
    }

    setTimeout(() => {
      this.postService.getMorePostsOnSearch(inputQuery, this.pageNumber, this.section).subscribe(
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
    this.pageNumber++;
    console.log(this.pageNumber);
  }

  onInput(event: any) {
    let inputQuery: string = this.inputSearch;
    this.posts = [];
    this.pageNumber = 0;
    if(inputQuery.charAt(0) == '#') {
      this.section = 'tags';
      inputQuery = inputQuery.slice(1);
    } else {
      this.section = 'posts';
    }
    console.log(inputQuery);
    console.log(this.section);
    this.getSearchResults(this.section, inputQuery);
  }

  getSearchResults(section, inputQuery) {
    this.searchService.getSearchResult(section, inputQuery)
      .subscribe(
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
      );
  }

}
