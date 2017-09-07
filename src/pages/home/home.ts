import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NavController , LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import {FirebaseApp, AngularFire, FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2';
import { AdvertDetailsPage } from '../advertDetails/advertDetails';
import { PreferedCategoryPage } from '../preferedcatetory/preferedcatetory';
import {Network} from '@ionic-native/network'
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { App, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public firebase:any;
  public storageRef: any
  public adverts : any[];
  public advertsToUpdata: FirebaseListObservable<any>;
  public trialSettings: FirebaseListObservable<any>;
    public trialSetting: FirebaseObjectObservable<any>;
  loading: Loading;
  constructor(public navCtrl: NavController,private storage: Storage, private sqlite: SQLite, af: AngularFire,public toastCtrl: ToastController, public afDatabase: AngularFireDatabase,public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
  // private network: Network,
  // let disconnectSub = network.onDisconnect().subscribe(() =>{
   // let confirm = this.alertCtrl.create({
   /////   title: 'Internet Connection',
   //   message: 'There is no internet connection',
   //   buttons: [{text: 'Okey',handler: () => {confirm.dismiss()}}]
   // });
   // confirm.present()
   //})
   
this.firebase = firebase;   
         this.trialSettings = af.database.list(`/trialSetting`);
    this.storage.get("catagories").then((val) => {
     var hasSetCategories = false;
     var userPreferedCategories = [];
     if(val != null){
     for(var i = 1; i <= val.length;i ++){
       var category = val[i];
       if(category != null){
        if(val[i].isActive){
          hasSetCategories = true;
          userPreferedCategories.push(val[i].name);
        }
       }
       
     }}

     if(!hasSetCategories){
       let confirm = this.alertCtrl.create({
      title: 'Please Note',
      message: 'You have not set up your prefered categories, You will not be able to see any advert. Would you like to set up your prefered categories?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.push(PreferedCategoryPage);
             }
        }
      ]
    });
    confirm.present();
     }else{
       this.advertsToUpdata = af.database.list('/advert'); 
        this.loading = this.loadingCtrl.create({
          content: 'Please wait...',
        });
        this.loading.present();
        this.storage.keys().then((favouritesData) => {
        af.database.list('/advert').subscribe(data => { 
          var today = new Date();    
          var advertDate = [];
         
          for(var i = 0; i <= data.length; i ++)
          {
            
            if(data[i] != null){  
              var startDate = new Date(data[i].dateStart);
              if(today < startDate && data[i].isApproved == true && userPreferedCategories.indexOf(data[i].category) > -1){
                  data[i].likedColor = 'gray';
                
                  var id = data[i].$key;
                if(favouritesData.indexOf(id) > -1){
                  data[i].likedColor = 'blue';
                }
                advertDate.push(data[i]);
               
              } 
            }
               
          }          
         /// this.storageRef = firebase.storage().ref().child('/images/49fc8543-0a97-4b70-a7c4.jpg');
         //           this.storageRef.getDownloadURL().then(url =>{
                      this.adverts = advertDate;
           ////           for(var ds = 0; ds <   this.adverts.length ;ds++){
           //           if(this.adverts[ds] != null){
            //            this.adverts[ds].imageRef = this.dataURItoBlob(url);
            //        }
           //           }
                    
            //        }
            //        );
        
           this.loading.dismiss();
           this.updateSetting()
           });
         
        })
     }
    });
  }

  public dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see stack overflow answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);
 
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
 
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
 
  // write the ArrayBuffer to a blob
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}
updateSetting() {
  var sdfsd = this.afDatabase.object(`/trialSetting/123456789`);
  this.trialSettings.forEach(data => {
  if(data[0].totalCount < data[0].limit ){
    var canPostForFree = this.storage.get('canPostForFree').then((val) => {
      if(val != true){
        this.storage.set('canPostForFree', true);
        var newTotalCount = data[0].totalCount + 1;
        this.trialSetting = data[0];
        sdfsd.update({totalCount: newTotalCount});
        let congratulationConfirm = this.alertCtrl.create({
            title: 'Congratulation, You have won',
            message: '1. Free consulatation to help plan your successful idea and turn it into its physical equivalent. 2. A once off free advertisement to initially market your product/service.',
            buttons: [
            {
                text: 'Okey',
                handler: () => {}
            }
            ]
          });
          congratulationConfirm.present();
       }
    });
      }
  });
   
}
 
 likeAdvert(advert){
    advert.likedColor = 'blue';
    this.storage.get(advert.$key).then((val) => {
      if(val == null){
         var favourite = {
           id: advert.$key,
      name: advert.name,
      category: advert.category,
      dateStart: advert.dateStart,
      timeStart: advert.timeStart,
      dateEnd:  advert.dateEnd,
      timeEnd: advert.timeEnd, 
      mobileNumber: advert.mobileNumber, 
      emailAddress: advert.emailAddress, 
      location: advert.location, 
      postAsaBusiness: advert.postAsaBusiness,  
      businessName: advert.businessName, 
      businessWebsite: advert.businessWebsite, 
      imageRef: advert.imageRef, 
      description: advert.description,
      isFavourite: true, 
      userDisplayName: advert.userDisplayName
   }
     this.storage.set(advert.$key, favourite);
   var advertLikesCount = advert.likeCount + 1;
   this.advertsToUpdata.update(advert.$key, {
            likeCount: advertLikesCount,
          });
        
      }
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
viewDetails(advert) {
    this.navCtrl.push(AdvertDetailsPage, advert);
}
}
