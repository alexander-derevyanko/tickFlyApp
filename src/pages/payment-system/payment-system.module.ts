import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentSystemPage } from './payment-system';

@NgModule({
  declarations: [
    PaymentSystemPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentSystemPage),
  ],
})
export class PaymentSystemPageModule {}
