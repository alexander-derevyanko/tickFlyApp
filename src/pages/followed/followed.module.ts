import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowedPage } from './followed';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    FollowedPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FollowedPage),
  ],
})
export class FollowedPageModule {}
