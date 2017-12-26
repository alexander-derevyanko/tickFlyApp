import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharingFollowersListPage } from './sharing-followers-list';

@NgModule({
  declarations: [
    SharingFollowersListPage,
  ],
  imports: [
    IonicPageModule.forChild(SharingFollowersListPage),
  ],
})
export class SharingFollowersListPageModule {}
