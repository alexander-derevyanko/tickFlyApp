import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {Headers} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class PaymentService {

  constructor(private http: Http, private authService: AuthService){ }

  getPaymentPackages() {
    return this.http.get(
    this.authService.API + `/api/v1/shop/get-pack-ticks`,
    {
      headers: new Headers({
        "Authorization": 'Bearer ' + this.authService.getToken()
      })
    })
  }

  getPaymentMethods() {
    return this.http.get(
      this.authService.API + `/api/v1/shop/get-payment-methods`,
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

  doPayment(stripeToken, price, currency) {
    return this.http.post(
      this.authService.API + `/api/v1/payments/stripe/pay`,
      {
        stripeToken: stripeToken,
        price: price,
        currency: currency
      },
      {
        headers: new Headers({
          "Authorization": 'Bearer ' + this.authService.getToken()
        })
      })
  }

}
