import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { App, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-advertDetails',
  templateUrl: 'advertDetails.html'
})

export class AdvertDetailsPage {
public advert: any;
  constructor(public navCtrl: NavController, navParams: NavParams, public Storage : Storage) {
      this.navCtrl = navCtrl;
    this.advert = navParams.data;
  }

  deleteAdvert(){
      this.Storage.remove(this.advert.id);
      this.navCtrl.pop();
  }

}
