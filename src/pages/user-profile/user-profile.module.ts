import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(UserProfilePage),
  ],
})
export class UserProfilePageModule {}
