import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {HttpService} from "../../services/http.service";
import {CreatePostPage} from "../create-post/create-post";
import {SearchPage} from "../search/search";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the CategoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html',
  providers: [LoaderService]
})
export class CategoryListPage {
  categoryList;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    public loadService: LoaderService
  ) {
  }

  ngOnInit() {
    this.loadService.showLoader();
    this.httpService.getCategories()
      .subscribe(
        response => {
          this.categoryList = response.json().category;
          console.log(response.json());
          this.loadService.hideLoader();
        },
        error => {
          this.loadService.hideLoader();
        }
      );
  }

  itemTapped(event, categoryId) {
    console.log(categoryId);
    this.navCtrl.setRoot(CategoryPage, {
      categoryId: categoryId
    });
  }

}
