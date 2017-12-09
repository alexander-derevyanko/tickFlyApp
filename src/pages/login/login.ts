import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, MenuController, ModalController, Nav, NavController, NavParams, Platform, ToastController,
  ViewController
} from 'ionic-angular';

import {RegisterPage} from "../register/register";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HomePage} from "../home/home";
import {GooglePlus} from "@ionic-native/google-plus";
import {ToastService} from "../../services/toast.service";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService, GooglePlus, ToastService],
})
export class LoginPage {

  rootPage: any;
  userData;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public googlePlus: GooglePlus,
    public toastService: ToastService,
    public menu: MenuController
  ) {
    this.rootPage = null;
    this.userData = null;
  }

  ngOnInit() {
    this.menu.close();
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  onSignin(form: NgForm) {
    console.log(form.value.email);
    console.log(form.value.password);
    this.authService.signin(form.value.email, form.value.password).subscribe(
      response => {
        console.log('Success');
        this.onHomePage();
        this.authService.getCurrentUserId();
        this.toastService.showToast('Вы успешно авторизированы!');
      },
      error => {
        console.log('Error');
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    );
  }

  signinGoogle() {


    console.log('test login');
    this.googlePlus.login({
      "webClientId": "61123529027-vrf9l1a8p8lcr847h9rj2r6c8r0mk1se.apps.googleusercontent.com"
    })
      .then(res => {
        let toast = this.toastCtrl.create({
          message: res,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
      .catch(err => {
        let toast = this.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'top'
        });
        toast.present();

      });
    // this.authService.signinGoogle().subscribe(
    //   response => {
    //     console.log('Success');
    //     console.log(response.text());
    //     let htmlAlert = response.text();
    //     this.presentModal(htmlAlert);
    //     // this.showPromptGoogle(htmlAlert);
    //   },
    //   error => {
    //     console.log('Error');
    //   }
    // );
  }
}
