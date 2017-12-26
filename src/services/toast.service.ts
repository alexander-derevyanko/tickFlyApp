import {Injectable} from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

  constructor(private toastCtrl: ToastController) { }


  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
