import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, Loading, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {NgForm} from "@angular/forms";
import {FilePath} from "@ionic-native/file-path";
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {Camera} from '@ionic-native/camera';
import {File} from "@ionic-native/file";
import {AuthService} from "../../services/auth.service";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
  providers: [UserService, ToastService, LoaderService]
})
export class EditUserPage {

  user;
  lastImage: string = null;
  loading: Loading;
  debugText: string;
  options: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userService: UserService,
              private camera: Camera,
              private transfer: Transfer,
              private file: File,
              private filePath: FilePath,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public authService: AuthService,
              public toastService: ToastService,
              public loadService: LoaderService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPage');
  }

  ngOnInit() {
    this.userService.getEditProfile()
      .subscribe(
        response => {
          this.user = response.json().user;
          console.log(this.user);
        },
        error => {
          console.log(error);
        }
      );
  }

  onChangeUser(form: NgForm) {
    this.loadService.showLoader();
    if(this.lastImage !== null) {
      this.uploadImage();
    }
    this.userService.changeUser(
      form.value.nick_name,
      form.value.first_name,
      form.value.last_name,
      form.value.status
    ).subscribe(
      response => {
        console.log('Success');
        this.loadService.hideLoader();
        this.toastService.showToast('Ваши данные изменены!');
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


  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Выберите изображение',
      buttons: [
        {
          text: 'Загрузить из галереи',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Камера',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Отмена',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Ошибка при выборе изображения!');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = this.authService.API + '/api/v1/user/update-avatar';

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    console.log(targetPath);

    var options = {
      fileKey: "avatar",
      fileName: this.lastImage,
      chunkedMode: false,
      httpMethod: "post",
      mimeType: "image/*",
      headers: {
        "Authorization": 'Bearer ' + this.authService.getToken()
      }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Загрузка...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      this.presentToast('Аватар успешно изменен!');
    }, err => {
      this.loading.dismissAll();
      this.options = JSON.stringify(options);
      this.debugText = JSON.stringify(err);
      this.presentToast('Ошибка загрузки изображения!' + JSON.stringify(err));
    });
  }


}
