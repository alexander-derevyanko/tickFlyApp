import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopPage } from './shop';
import {ComponentsModule} from "../../components/components.module";
import {PaymentSystemPage} from "../payment-system/payment-system";

@NgModule({
  declarations: [
    ShopPage,
    PaymentSystemPage
  ],
  entryComponents: [
    PaymentSystemPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ShopPage),
  ],
})
export class ShopPageModule {}
