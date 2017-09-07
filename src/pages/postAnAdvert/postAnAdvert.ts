import {Component ,ViewChild} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading ,AlertController, ModalController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import {AutocompletePage} from '../autocomplete/autocomplete';
import { HomePage } from '../home/home';
import { GlobalValidator} from '../validators/username'

declare var cordova: any;

@Component({
  selector: 'page-postAnAdvert',
  templateUrl: 'postAnAdvert.html'
})

export class PostAnAdvertPage {
  selectImagePath =  null;
  captureDataUrl: string;
    loading: Loading;
     public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
   pages: Array<{title: string, component: any, icon: string}>;
    adverts: FirebaseListObservable<any>;
today = new Date();
startTime = this.today.getHours()+":"+this.today.getMinutes();
public advert = {
  advertName: undefined,
      category: undefined,
      dateStart: new Date().toISOString(), 
      timeStart: this.startTime.toString(),
      dateEnd:  new Date().toISOString(), 
      timeEnd: '12:59', 
      mobileNumber: undefined, 
      emailAddress: undefined, 
      location: undefined, 
      postAsaBusiness: false, 
      businessName: '', 
      businessWebsite: '', 
      isApproved: false,
      likeCount: 0,
      imageRef: '',
      userDisplayName: undefined,
      discription: undefined,
      businessPassword: ''
}
  @ViewChild('signupSlider') signupSlider: any;
    searchQuery: string = '';
    items: string[];
    slideOneForm: FormGroup;
    slideTwoForm: FormGroup;
    slideThreeForm: FormGroup;
    slideFourForm: FormGroup;
    businessName: AbstractControl;
    businessWebsite: AbstractControl;
    businessPassword: AbstractControl;
    submitAttempt: boolean = false;
   
 
  constructor(public navCtrl: NavController ,public alertCtrl: AlertController, private modalCtrl:ModalController, public formBuilder: FormBuilder,public  af: AngularFire, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private imagePicker: ImagePicker ) {
     this.adverts = af.database.list('/advert');
     
     this.myPhotosRef = firebase.storage().ref('/Photos/');
    this.slideOneForm = formBuilder.group({
        advertName: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        mobileNumber: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(10),Validators.pattern('[0-9]*'), Validators.required])],
       discription: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        location: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        category: ['', Validators.compose([Validators.required])],    
    });
    this.slideTwoForm = formBuilder.group({
        timeEnd: ['', Validators.compose([Validators.required])],
        dateEnd: ['', Validators.compose([Validators.required])],
        dateStart: ['', Validators.compose([Validators.required])],
        timeStart: ['', Validators.compose([Validators.required])],
    }); 
    this.slideFourForm = formBuilder.group({
        emailAddress: ['', Validators.compose([Validators.minLength(2), Validators.required,Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
        userDisplayName: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        postAsaBusiness: [false],
        businessName: [''],
        businessPassword: [''],
        businessWebsite: [''],
    });
     this.businessName = this.slideFourForm.controls['businessName'];   
     this.businessWebsite = this.slideFourForm.controls['businessWebsite'];
     this.businessPassword = this.slideFourForm.controls['businessPassword'];
     this.slideThreeForm = formBuilder.group({
        imageIsLoaded: [false],
         imageRef: [""],
    });
  }
  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.advert.location = data;
    });
    modal.present();
  }

 next(){
        this.signupSlider.slideNext();
    }
 
    prev(){
        this.signupSlider.slidePrev();
    }
    postAsaBusinessChanged(){
      if(this.advert.postAsaBusiness){
        this.businessName.setValidators([Validators.required]);
          this.businessPassword.setValidators([Validators.required]);
           this.businessWebsite.setValidators([Validators.required]);
            this.businessName.enable(false);
          this.businessPassword.enable(false);
           this.businessWebsite.enable(false);
      }
      else{
         this.businessName.disable(true);
          this.businessPassword.disable(true);
           this.businessWebsite.disable(true);
      }
    }

    getDateOnly(datetime){
      var date;
      var month = ("0" + (datetime.getMonth() + 1)).slice(-2);
      var day = ("0" + (datetime.getDate())).slice(-2);
      date = day + "/" + month + "/" + datetime.getFullYear();
      return date;
    }
  save(){

var startDate = this.getDateOnly(new Date(this.advert.dateStart));
var endDate = this.getDateOnly(new Date(this.advert.dateEnd));
 
    this.submitAttempt = true;
 
    if(!this.slideOneForm.valid){
        this.signupSlider.slideTo(0);
    } 
    else if(!this.slideTwoForm.valid){
        this.signupSlider.slideTo(1);
    }
    else if(new Date(this.advert.dateStart) < new Date()){
        let toast = this.toastCtrl.create({
          message: 'Start date can not be in the past',
          duration: 2000
        });
        toast.present();
        this.signupSlider.slideTo(1);
    }
    else if(new Date(this.advert.dateEnd) < new Date()){
       let toast = this.toastCtrl.create({
          message: 'End date can not be in the past',
          duration: 2000
        });
        toast.present();
        this.signupSlider.slideTo(1);
    }
     else if(new Date(this.advert.dateEnd) < new Date(this.advert.dateEnd)){
       let toast = this.toastCtrl.create({
          message: 'End date can not be less than start date',
          duration: 2000
        });
        toast.present();
        this.signupSlider.slideTo(1);
    }
    else if(!this.slideThreeForm.valid){
        this.signupSlider.slideTo(2);
    }else if(!this.slideFourForm.valid){
        this.signupSlider.slideTo(3);
    }
    else {
      let confirm = this.alertCtrl.create({
      title: 'Disclaimer',
      message: 'We have received a request for posting an ad.Our agents will contact you shotly and in no time, your ad will be online billbaord. DVERT.',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {

          }
        },
        {
          text: 'Agree',
          handler: () => {
          this.loading = this.loadingCtrl.create({
              content: 'Please wait...',
          });
          this.loading.present();
          if(this.advert.postAsaBusiness){
            this.af.database.list('/user').forEach(data => {
              var user = null;
                for(var index = 0; index < data.length; index ++) {              
                  if(data[index].username.toLowerCase() == this.advert.emailAddress && data[index].businessName.toLowerCase() == this.advert.userDisplayName && data[index].businessPassword == this.advert.businessPassword){
                    user = data[index];
                    break;
                  }
              }
            if(user != null){
                 this.adverts.push(this.advert);
                  confirm.dismiss();
                   this.loading.dismiss();
                  this.presentToast('Your advert is added successfully');
                  this.navCtrl.push(HomePage);
            }else{
              this.presentToast("Your details do not match with the business details.");
              confirm.dismiss();
              this.loading.dismiss();
            }
            });
          }else{
              this.adverts.push(this.advert);
              confirm.dismiss();
              this.loading.dismiss();
              this.presentToast('Your advert is added successfully');
              this.navCtrl.push(HomePage);
          }
         // let storageRef = firebase.storage().ref();
          // Create a timestamp as filename
          const filename = Math.floor(Date.now() / 1000);
          // Create a reference to 'images/todays-date.jpg'
         // const imageRef = storageRef.child(`images/${filename}.jpg`);
         
          this.presentToast(this.captureDataUrl);
          let storageRef = firebase.storage().ref();
          let imageName = this.generateUUID();
         
           this.file.readAsArrayBuffer(this.captureDataUrl, name)
                    .then(function (success) {
                     var blob = new Blob([success], {type: "image/jpeg"});
                      let imageRef = storageRef.child(`images/${imageName}.jpg`).putString(this.captureDataUrl);
          imageRef.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
         
      },
      (error) => {
        // upload failed
        this.presentToast('upload failed');
        console.log(error)
      },
      () => {
        // upload success
        this.presentToast('upload success');
      }
                    
    );})

         
          }
        }
      ]
    });
    confirm.present()
    }
  }

  private uploadPhoto(): void {
    this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
          this.presentToast('done.');
      });
  }
 
  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
 


lastImage: string = null;
 
  public presentActionSheet() {   
  // Create options for the Camera Dialog
  var options =  {
  quality: 100,
   outputType: 0,
     maximumImagesCount: 1,
  
}
    this.imagePicker.getPictures(options).then((imagePath) => {
      this.presentToast('Upload started.');
      this.myPhoto = imagePath;
      //this.uploadPhoto();
        this.lastImage = imagePath;
        this.selectImagePath =  imagePath; 
       this.captureDataUrl = 'data:image/jpeg;base64,' + imagePath;
           this.captureDataUrl = imagePath; 
           
}, (err) => {
   this.presentToast('Error while selecting image.');
   this.selectImagePath = 'assets/img/vert_logo.png'
   this.captureDataUrl = 'data:image/jpeg;base64,' + this.selectImagePath;
 });
}
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'bottom'
  });
  toast.present();
}
}
  
