import {Component ,ViewChild} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading ,AlertController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

declare var cordova: any;

@Component({
  selector: 'page-postAnAdvert',
  templateUrl: 'postAnAdvert.html'
})

export class PostAnAdvertPage {
  selectImagePath =  null;
  captureDataUrl: string;
    loading: Loading;
   pages: Array<{title: string, component: any, icon: string}>;
    adverts: FirebaseListObservable<any>;
today = new Date();
startTime = this.today.getHours()+":"+this.today.getMinutes();
public advert = {
  name: undefined,
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
      businessRegistrationNumber: '', 
      businessWebsite: '', 
      isApproved: false,
      imageRef: undefined,
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
    businessRegistrationNumber: AbstractControl;
    submitAttempt: boolean = false;
   
 
  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public formBuilder: FormBuilder,  af: AngularFire, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private imagePicker: ImagePicker ) {
     this.adverts = af.database.list('/advert');
    this.slideOneForm = formBuilder.group({
        advertName: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        mobileNumber: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(10),Validators.pattern('[0-9]*'), Validators.required])],
        emailAddress: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        location: ['', Validators.compose([Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        category: ['', Validators.compose([Validators.required])],    
    });
    this.slideTwoForm = formBuilder.group({
        timeEnd: ['', Validators.compose([Validators.required])],
        dateEnd: ['', Validators.compose([Validators.required])],
        dateStart: ['', Validators.compose([Validators.required])],
        timeStart: ['', Validators.compose([Validators.required])],
    }); 
    this.slideFourForm = formBuilder.group({
        postAsaBusiness: [false],
        businessName: [''],
        businessRegistrationNumber: [''],
        businessWebsite: [''],
    });
     this.businessName = this.slideFourForm.controls['businessName'];   
     this.businessWebsite = this.slideFourForm.controls['businessWebsite'];
     this.businessRegistrationNumber = this.slideFourForm.controls['businessRegistrationNumber'];
     this.slideThreeForm = formBuilder.group({
        imageIsLoaded: [false],
         imageRef: [""],
    });
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
          this.businessRegistrationNumber.setValidators([Validators.required]);
           this.businessWebsite.setValidators([Validators.required]);
            this.businessName.enable(false);
          this.businessRegistrationNumber.enable(false);
           this.businessWebsite.enable(false);
      }
      else{
         this.businessName.disable(true);
          this.businessRegistrationNumber.disable(true);
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
          let storageRef = firebase.storage().ref();
          // Create a timestamp as filename
          const filename = Math.floor(Date.now() / 1000);
          // Create a reference to 'images/todays-date.jpg'
          const imageRef = storageRef.child(`images/${filename}.jpg`);
          
          imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
            // Do something here when the data is succesfully uploaded!
            this.loading.dismiss(); 
            this.presentToast("Advert has been added successfully");
          });                    
          }
        }
      ]
    });
    confirm.present()
    }
  }

    initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
 
}

lastImage: string = null;
 
  public presentActionSheet() {   
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    maximumImagesCount: 1
  }; 
    this.imagePicker.getPictures(options).then((imagePath) => {
        this.lastImage = imagePath;
        this.selectImagePath =  imagePath;  
           this.captureDataUrl = 'data:image/jpeg;base64,' + imagePath; 
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
  
