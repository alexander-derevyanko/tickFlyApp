import {Injectable} from '@angular/core';
import 'rxjs/add/operator/filter';
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {ToastController} from "ionic-angular";
import {GooglePlus} from "@ionic-native/google-plus";
import {AuthService} from "./auth.service";

@Injectable()
export class ShareService {

  constructor(public http: Http, public authService: AuthService) {

  }

  getFollowers() {
    return this.http.get(this.authService.API + `/api/v1/chat/share-post`,
      {headers: new Headers({
        "Authorization": 'Bearer ' + this.authService.getToken()
      })})
  }

  sharePost(postId, userId) {
    return this.http.post(
      this.authService.API + "/api/v1/chat/send-post",
      {
        id_post: postId,
        receiver_id: userId,
        message_type: "post"
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

}