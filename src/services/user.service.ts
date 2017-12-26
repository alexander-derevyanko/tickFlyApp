import {Injectable} from "@angular/core";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Http} from "@angular/http";
import {AuthService} from "./auth.service";
import {Headers} from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http, private authService: AuthService) {

  }

  API = "http://localhost:8080";

  getProfile(idUser) {
    return this.http.get(
      this.authService.API + `/api/v1/user/profile?id_user=` + idUser,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getFollowers(idUser) {
    return this.http.get(
      this.authService.API + `/api/v1/user/followers?id_user=` + idUser,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getFollowed(idUser) {
    return this.http.get(this.authService.API + `/api/v1/user/followed?id_user=` + idUser,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  toggleSubscribe(idUser) {
    return this.http.put(
      this.authService.API + `/api/v1/user/subscribe-unsubscribe`,
      {
        id_user: idUser
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getEditProfile() {
    return this.http.get(
      this.authService.API + `/api/v1/user/edit-profile`,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  changeUser(nickname: string, firstname: string, lastname: string, status: string) {
    return this.http.put(
      this.authService.API + `/api/v1/user/update`,
      {
        nick_name: nickname,
        first_name: firstname,
        last_name: lastname,
        status: status
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  changePassword(oldPassword: string, newPassword: string, confirmationPassword: string) {
    return this.http.put(
      this.authService.API + `/api/v1/user/change-password`,
      {
        old_password: oldPassword,
        new_password: newPassword,
        password_confirmation: confirmationPassword
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  getComplaintReasons() {
    return this.http.get(
      this.authService.API + `/api/v1/complaint/get-description`,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      }
    )
  }

  setComplaintReason(postId, authorId, reasonId) {
    console.log(postId + ' ' + authorId + ' ' + reasonId);
    return this.http.post(
      this.authService.API + `/api/v1/user/set-complaint`,
      {
        id_complaints: reasonId,
        id_post: postId,
        id_user: authorId
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      }
    )
  }


}
