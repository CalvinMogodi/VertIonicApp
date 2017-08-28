import {Component } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

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
  lastImage: string = null;
  loading: Loading;
  public presentActionSheet() {
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

  public advert = {
     name: undefined,
      category: undefined,
      dateStart: undefined, 
      timeStart: undefined, 
      dateEnd: undefined, 
      timeEnd: undefined, 
      mobileNumber: undefined, 
      emailAddress: undefined, 
      location: undefined, 
      postAsaBusiness: false, 
      businessName: '', 
      businessRegistrationNumber: '', 
      businessWebsite: '', 
      isApproved: false,
      imageRef: undefined,
  };
  advertForm: FormGroup;
  adverts: FirebaseListObservable<any>;
 formIsSubmitted = false;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,  af: AngularFire, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {
      this.adverts = af.database.list('/avert');
    this.advertForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [undefined, Validators.required],
      dateStart: ['', Validators.required], 
      timeStart: ['', Validators.required], 
      dateEnd: ['', Validators.required], 
      timeEnd: ['', Validators.required], 
      mobileNumber: ['', Validators.required], 
      emailAddress: ['', Validators.required], 
      location: ['', Validators.required], 
      postAsaBusiness: [false, Validators.required], 
      businessName: [''], 
      businessRegistrationNumber: [''], 
      businessWebsite: [''], 
      isApproved: [false],
      isFreeAdvert: [false],
    });
  }
  
  submit(): void {
     
 
  // File name only
  var filename = this.lastImage;
      this.formIsSubmitted = false;
       // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
      if(this.advertForm.valid && this.lastImage != undefined){
            let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    imageRef.putString(targetPath, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
     // Do something here when the data is succesfully uploaded!
     this.advert.imageRef = imageRef;
       this.adverts.push(this.advert);

        let toast = this.toastCtrl.create({
          message: 'Advert is added successfully',
          duration: 2000
        });
        toast.present();
    });
      
      }
  }

isValid(field: string) {
    let formField = this.advertForm.get(field);
    return formField.valid || formField.pristine;
  }

  postAsaBusinessChanged() {
        
    if(!this.advert.postAsaBusiness){
      this.advertForm.controls['businessName'].invalid;   
      this.advertForm.controls['businessRegistrationNumber'].invalid;
       this.advertForm.controls['businessWebsite'].invalid;
    }else{
       this.advertForm.controls['businessName'].valid;   
      this.advertForm.controls['businessRegistrationNumber'].valid;
       this.advertForm.controls['businessWebsite'].valid;
    }
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
    this.presentToast('Error while selecting image.');
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

//this.firebase.getToken()
  //.then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
  //.catch(error => console.error('Error getting token', error));

//this.firebase.onTokenRefresh()
 // .subscribe((token: string) => console.log(`Got a new token ${token}`));
