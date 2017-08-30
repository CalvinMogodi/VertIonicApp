import {Component ,ViewChild} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading ,AlertController} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

@Component({
  selector: 'page-postAnAdvert',
  templateUrl: 'postAnAdvert.html'
})

export class PostAnAdvertPage {
   pages: Array<{title: string, component: any, icon: string}>;
today = new Date();
startTime = this.today.getHours()+":"+this.today.getMinutes();
public advert = {
  name: undefined,
      category: undefined,
      dateStart: new Date().toISOString(), 
      timeStart: this.startTime,
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
   
 
  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public formBuilder: FormBuilder,  af: AngularFire, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {
    
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
    else if(!this.slideThreeForm.valid){
        this.signupSlider.slideTo(2);
    }else if(!this.slideFourForm.valid){
        this.signupSlider.slideTo(3);
    }
    else {
      let confirm = this.alertCtrl.create({
      title: 'DIsclamer',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
           this.navCtrl.goToRoot("Billboard");
            let toast = this.toastCtrl.create({
                message: "Advert has been added successfully",
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
             
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
  loading: Loading;
  public presentActionSheet() {
    let toast = this.toastCtrl.create({
          message: 'Take photo stated',
          duration: 2000
        });
        toast.present();
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
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
 
//this.camera.getPicture({
  //   sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    // destinationType: this.camera.DestinationType.DATA_URL
    //}).then((imageData) => {
     // this.base64Image = 'data:image/jpeg;base64,'+imageData;
     //}, (err) => {
      //console.log(err);
    //});

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
    this.presentToast('Error while selecting image.'+err);
  });
}
// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
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
}
  
