import { Component } from '@angular/core';
import { NavController , NavParams, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FavouritePage } from '../favourite/favourite';
import { HomePage } from '../home/home';
import { App, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-advertDetails',
  templateUrl: 'advertDetails.html'
})

export class AdvertDetailsPage {
public advert: any;
  constructor(public navCtrl: NavController, navParams: NavParams, public Storage : Storage,  public toastCtrl: ToastController) {
      this.navCtrl = navCtrl;
    this.advert = navParams.data;
  }

  deleteAdvert(){
      this.Storage.remove(this.advert.id);
      this.navCtrl.push(FavouritePage, this.advert);
      this.presentToast("Advert is deleted successfully");
  }

   back(){
     if(this.advert.isFavourite){
        this.navCtrl.push(FavouritePage, this.advert);
     }else{
        this.navCtrl.push(HomePage);
     }
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
