import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CreatePostPage} from './create-post';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CreatePostPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(CreatePostPage),
  ],
})
export class CreatePostPageModule {
}
