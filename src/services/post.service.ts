import {Injectable} from "@angular/core";
import {AlertController, ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {Headers} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class PostService {
  constructor(
    private http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {

  }

  tickCount: number = 0;

  getBalance() {
    return this.http.get(
      this.authService.API + `/api/v1/user/get-user-balance`,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  setTick(postId: number, userId: number, tick: number) {
    return this.http.post(
      this.authService.API + `/api/v1/user/set-tick`,
      {
        id_post: postId,
        id_user: userId,
        amount: tick
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  createPost(title: string, description: string, categories = [], tags: string) {
    return this.http.post(
      this.authService.API + `/api/v1/post/save`,
      {
        title: title,
        description: description,
        cat_ids: categories,
        tags: tags
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getMorePostsOnHome(pageNumber) {
    return this.http.get(
      this.authService.API + `/api/v1/post?page=` + pageNumber,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getMorePostsOnCategory(catId, pageNumber) {
    return this.http.get(
      this.authService.API + `/api/v1/category/post-by-cat/` + catId + `?page=` + pageNumber,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getMorePostsOnProfile(userId, pageNumber) {
    return this.http.get(
      this.authService.API + `/api/v1/user/profile?id_user=` + userId + `&page=` + pageNumber,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getMorePostsOnSearch(query, pageNumber, section) {
    return this.http.get(
      this.authService.API + `/api/v1/search?section=` + section + `&q=` + query + `&page=` + pageNumber,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getMorePostsOnTagSearch(tagId, pageNumber) {
    return this.http.get(
      this.authService.API + `/api/v1/post-by-tag/` + tagId + '?page=' + pageNumber,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  deletePost(postId) {
    return this.http.delete(
      this.authService.API + `/api/v1/post/delete/` + postId,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }


}
