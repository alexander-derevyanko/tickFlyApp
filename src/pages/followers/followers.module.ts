import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowersPage } from './followers';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    FollowersPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FollowersPage),
  ],
})
export class FollowersPageModule {}
