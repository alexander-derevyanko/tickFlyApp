import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Headers} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class HttpService{

  posts = [];

  constructor(private http: Http, private authService: AuthService){ }

  getPosts() {
    return this.http.get(this.authService.API + `/api/v1/post/`,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

  getPost(postId) {
    return this.http.get(this.authService.API + `/api/v1/post/by-id/` + postId,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

  getCategories() {
    return this.http.get(this.authService.API + `/api/v1/category/`,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

  getCategory(categoryId) {
    return this.http.get(this.authService.API + `/api/v1/category/post-by-cat/` + categoryId,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

  setComment(postId, comment) {
    return this.http.post(this.authService.API + `/api/v1/post/set-comment`,
      {
        id_post: postId,
        comment: comment
      },
      {
        headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})
      })
  }
}
