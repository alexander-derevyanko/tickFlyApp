import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Stripe} from "@ionic-native/stripe";
import {NgForm} from "@angular/forms";
import {PaymentService} from "../../services/payment.service";
import {PaymentSystemPage} from "../payment-system/payment-system";

/**
 * Generated class for the ShopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
  providers: [PaymentService]
})
export class ShopPage {

  payment: string;
  selectedItem: any;
  packageList = [];
  paymentSystems = [];
  selectedPackage;
  selectedPaymentSystem: string;
  code: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public paymentService: PaymentService
  ) {
    this.payment = 'input';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  ngOnInit() {
    this.getTickPackages();
    this.getPaymentSystems();
  }

  segmentChanged(event) {
    console.log(event);
  }

  getTickPackages() {
    this.paymentService.getPaymentPackages()
      .subscribe(
        response => {
          console.log(response.json());
          this.packageList = response.json().packages[0].cost_ticks;
          this.code = response.json().packages[0].code;
        },
        error => {
          console.log(error);
        }
      );
  }

  getPaymentSystems() {
    this.paymentService.getPaymentMethods()
      .subscribe(
        response => {
          console.log(response.json());
          this.paymentSystems = response.json().payment_systems;
        },
        error => {
          console.log(error);
        }
      );
  }

  onPaymentSystemPage(code, amount, paymentSystem) {
    this.navCtrl.push(PaymentSystemPage, { code: code, amount: amount, paymentSystem: paymentSystem });
  }

}
