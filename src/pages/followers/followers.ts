import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserProfilePage} from "../user-profile/user-profile";

/**
 * Generated class for the FollowersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
})
export class FollowersPage {

  selectedItem: any;
  icons: string[];
  followersList = [];
  followedList;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.followersList = navParams.get('followersList');
  }

  itemTapped(event, idUser) {
    console.log(idUser);
    this.navCtrl.setRoot(UserProfilePage, {
      userId: idUser
    });
  }

}
