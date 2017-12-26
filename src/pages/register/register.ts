import {Component, ViewChild} from '@angular/core';
import {IonicPage, Nav, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MyApp} from "../../app/app.component";
import {HomePage} from "../home/home";
import {LoginPage} from "../login/login";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [ToastService, LoaderService]
})
export class RegisterPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public toastService: ToastService,
    public loadService: LoaderService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  onSignup(form: NgForm) {
    console.log('signup');
    this.loadService.showLoader();
    this.authService.signup(form.value.nickname, form.value.email, form.value.password)
      .subscribe(
        response => {
          console.log('Success');
          this.onHomePage();
          this.authService.getCurrentUserId();
          this.loadService.hideLoader();
          this.toastService.showToast('Вы успешно зарегистрированы!');
        },
        error => {
          console.log('Error');
          this.loadService.hideLoader();
          let errors = error.json().errors;
          let firstError = errors[Object.keys(errors)[0]];
          this.toastService.showToast(firstError);
        }
      );
  }

}
