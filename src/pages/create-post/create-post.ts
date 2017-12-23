import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";
import {SearchPage} from "../search/search";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";
import {MultiImageUpload} from "../../components/multi-image-upload/multi-image-upload";

/**
 * Generated class for the CreatePostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-post',
  templateUrl: 'create-post.html',
  providers: [PostService, ToastService, LoaderService]
})
export class CreatePostPage {
  public myModel = ''
  categories = [];
  selectedCategories = [];
  @ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
  protected uploadFinished = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public toastService: ToastService,
    public loadService: LoaderService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePostPage');
  }

  onChange(selectedCategories) {
    console.log("Selected " + selectedCategories);
    console.log(this);
    if(this.selectedCategories.length <= 2){
      console.log(this.selectedCategories);
    } else {
      console.log(this.selectedCategories);
      return false;
    }
  }

  onSelectItem(selectedItem) {
    console.log("Selected " + selectedItem);
  }

  ngOnInit() {
    this.httpService.getCategories()
      .subscribe(
        response => {
          console.log(response.json());
          this.categories = response.json().category;
        },
        error => {
          console.log(error);
        }
      );
  }

  onCreatePost(form: NgForm) {
    this.loadService.showLoader();
    console.log(form.value.title);
    console.log(form.value.description);
    console.log(form.value.selectedCategories);
    console.log(form.value.tags);

    this.postService.createPost(
      form.value.title,
      form.value.description,
      this.selectedCategories,
      form.value.tags
    ).subscribe(
      response => {
        console.log(response.json());
        this.onSubmitUploadImages();
        this.onHomePage();
        this.loadService.hideLoader();
        this.toastService.showToast('Пост успешно создан!');
      },
      error => {
        this.loadService.hideLoader();
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    )
  }

  _keyPress(event: any) {
    const pattern = /[а-яa-z1-9\\#\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }



  onSubmitUploadImages() {
    if (this.multiImageUpload.images.length >= 4) {
      this.toastService.showToast("Вы не можете добавить больше 5-ти изображений");
      return;
    }

    this.multiImageUpload.uploadImages().then((images) => {
      this.uploadFinished = true;
      console.dir(images);
    }).catch(() => {
    });
  }
}
