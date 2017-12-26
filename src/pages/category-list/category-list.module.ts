import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CategoryListPage} from './category-list';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CategoryListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(CategoryListPage),
  ],
})
export class CategoryListPageModule {
}
