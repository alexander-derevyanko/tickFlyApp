import {Component} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActionSheetController, AlertController, Platform, ToastController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {TransferObject} from "@ionic-native/transfer";
import {ToastService} from "../../services/toast.service";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";

@Component({
    selector: 'multi-image-upload',
    templateUrl: 'multi-image-upload.html',
    providers: [Camera, File, FilePath, Platform, AuthService, LoaderService]
})

export class MultiImageUpload {
    public serverUrl = this.authService.API + `/api/v1/post/save-media`;

    public isUploading = false;
    public uploadingProgress = {};
    public uploadingHandler = {};
    public images: any = [];
    protected imagesValue: Array<any>;
    public hasImages: boolean = true;

    constructor(
      private sanitization: DomSanitizer,
      private actionSheetCtrl: ActionSheetController,
      private camera: Camera,
      private file: File,
      public toastService: ToastService,
      public authService: AuthService,
      public loadService: LoaderService
    ) {
    }

    public uploadImages(postId: number): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.isUploading = true;
            Promise.all(this.images.map(image => {
                return this.uploadImage(image, postId);
            }))
                .then(resolve)
                .catch(reason => {
                    this.isUploading = false;
                    this.uploadingProgress = {};
                    this.uploadingHandler = {};
                    reject(reason);
                });

        });
    }

    public abort() {
        if (!this.isUploading)
            return;
        this.isUploading = false;
        for (let key in this.uploadingHandler) {
            this.uploadingHandler[key].abort();
        }
    }

    // ======================================================================

    protected removeImage(image) {
        if (this.isUploading)
            return;
        this.util.removeFromArray(this.imagesValue, image);
        this.util.removeFromArray(this.images, image.url);
    }

    protected showAddImage() {
        if (!window['cordova']) {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = "image/x-png,image/gif,image/jpeg";
            input.click();
            input.onchange = () => {
                let blob = window.URL.createObjectURL(input.files[0]);
                this.images.push(blob);
                this.util.trustImages();
            }
        } else {
            new Promise((resolve, reject) => {
                let actionSheet = this.actionSheetCtrl.create({
                    title: 'Добавить изображение',
                    buttons: [
                        {
                            text: 'Загрузить из галереи',
                            handler: () => {
                                resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
                            }
                        },
                        {
                            text: 'Камера',
                            handler: () => {
                                resolve(this.camera.PictureSourceType.CAMERA);
                            }
                        },
                        {
                            text: 'Отмена',
                            role: 'cancel',
                            handler: () => {
                                reject();
                            }
                        }
                    ]
                });
                actionSheet.present();
            }).then(sourceType => {
                if (!window['cordova'])
                    return;
                let options: CameraOptions = {
                    quality: 100,
                    sourceType: sourceType as number,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };
                this.camera.getPicture(options).then((imagePath) => {
                    this.images.push(imagePath);
                    this.util.trustImages();
                });
            }).catch(() => {
            });
        }
    }


    private uploadImage(targetPath, postId) {
        return new Promise((resolve, reject) => {
            this.uploadingProgress[targetPath] = 0;
            console.log('uploadImage Begin');

            if (window['cordova']) {
              console.log('uploadImage Begin Cordova');
                let options = {
                  fileKey: "post_media",
                  fileName: targetPath,
                  chunkedMode: false,
                  httpMethod: "post",
                  mimeType: "image/*",
                  params: {
                      id_post: postId
                  },
                  headers: {
                    "Authorization": 'Bearer ' + this.authService.getToken()
                  }
                };
              console.log('uploadImage After Options created');
              // console.log('serverUrl ' + this.serverUrl);
              // console.log('fileKey ' + options.fileKey);
              // console.log('fileName ' + options.fileName);
              // console.log('chunkedMode ' + options.chunkedMode);
              // console.log('httpMethod ' + options.httpMethod);
              // console.log('mimeType ' + options.mimeType);
              // console.log('id_post ' + options.params.id_post);
              // console.log('headers ' + options.headers);
                const fileTransfer = new TransferObject();
                this.uploadingHandler[targetPath] = fileTransfer;

                console.log('Before File Transfer Upload');
                fileTransfer.upload(targetPath, this.serverUrl, options).then(data => {
                    resolve(JSON.parse(data.response));
                    console.log('Success FileTransfer Upload');
                }).catch(error => {
                  console.log('Failed FileTransfer Upload');
                  console.log('code ' + error.code);
                  console.log('source ' + error.source);
                  console.log('target ' + error.target);
                  console.log('http_status ' + error.http_status);
                  console.log('body ' + error.body);
                  console.log('exception ' + error.exception);
                  this.toastService.showToast('Ошибка загрузки изображения!');
                  this.loadService.hideLoader();
                });

                fileTransfer.onProgress(event2 => {
                    this.uploadingProgress[targetPath] = event2.loaded * 100 / event2.total;
                });
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', targetPath, true);
                xhr.responseType = 'blob';
                xhr.onload = (e) => {
                    if (xhr['status'] != 200) {
                        this.util.showToast("Your browser doesn't support blob API");
                        console.error(e, xhr);
                    } else {
                        const blob = xhr['response'];
                        let formData: FormData = new FormData(),
                            xhr2: XMLHttpRequest = new XMLHttpRequest();
                        formData.append('files[]', blob);
                        this.uploadingHandler[targetPath] = xhr2;
                        xhr2.onreadystatechange = () => {
                            if (xhr2.readyState === 4) {
                                if (xhr2.status === 200)
                                    resolve(JSON.parse(xhr2.response));
                            }
                        };

                        xhr2.upload.onprogress = (event) => {
                            this.uploadingProgress[targetPath] = event.loaded * 100 / event.total;
                        };
                      console.log('cccccooonsole222');
                        xhr2.open('POST', this.serverUrl, true);
                        xhr2.send(formData);
                    }
                };
                xhr.send();
            }
        });
    }

    private util = ((_this: any) => {
        return {
            removeFromArray<T>(array: Array<T>, item: T) {
                let index: number = array.indexOf(item);
                if (index !== -1) {
                    array.splice(index, 1);
                }
            },
            trustImages() {
                _this.imagesValue = _this.images.map(
                    val => {
                        return {
                            url: val,
                            sanitized: _this.sanitization.bypassSecurityTrustStyle("url(" + val + ")")
                        }
                    }
                );
            },
            showToast(text: string) {
                _this.toastCtrl.create({
                    message: text,
                    duration: 5000,
                    position: 'top'
                }).present();
            }
        }
    })(this);
}
