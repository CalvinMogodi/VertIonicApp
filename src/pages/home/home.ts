import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NavController , LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable, AngularFireDatabase} from 'angularfire2';
import { AdvertDetailsPage } from '../advertDetails/advertDetails';
import { PreferedCategoryPage } from '../preferedcatetory/preferedcatetory';

import { App, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public sqlitedb: SQLite
  public adverts : any[];
  public advertsToUpdata: FirebaseListObservable<any>;
  loading: Loading;
  constructor(public navCtrl: NavController,private storage: Storage, private sqlite: SQLite, af: AngularFire,public toastCtrl: ToastController, public afDatabase: AngularFireDatabase,public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    this.storage.get("catagories").then((val) => {
     var hasSetCategories = false;
     if(val != null){
     for(var i = 1; i <= val.length;i ++){
       var category = val[i];
       if(category != null){
        if(val[i].isActive){
          hasSetCategories = true;
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
    confirm.present()
     }else{
       this.advertsToUpdata = af.database.list('/avert'); 
        this.loading = this.loadingCtrl.create({
          content: 'Please wait...',
        });
        this.loading.present();
        af.database.list('/avert').subscribe(data => {       
          this.adverts = data;
          this.loading.dismiss();
        })
     }
    });
  }

 
 likeAdvert(advert){
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
      isFavourite: true, 
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
