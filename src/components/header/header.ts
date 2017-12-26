import {Component, Input} from '@angular/core';
import {ChatListPage} from "../../pages/chat-list/chat-list";
import {CreatePostPage} from "../../pages/create-post/create-post";
import {SearchPage} from "../../pages/search/search";
import {NavController} from "ionic-angular";

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-main',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  @Input() text: string;
  @Input() search: boolean;
  @Input() createPost: boolean;
  @Input() messages: boolean;
  @Input() menu: boolean;

  constructor(public navCtrl: NavController) {
    console.log('Hello HeaderComponent Component');
    this.text = 'Hello World';
  }

  onCreatePostPage() {
    this.navCtrl.push(CreatePostPage);
  }

  onChatsListPage() {
    this.navCtrl.push(ChatListPage);
  }

  onSearchPage() {
    this.navCtrl.push(SearchPage);
  }

}
