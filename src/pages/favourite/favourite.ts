import { Component ,Input} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AdvertDetailsPage } from '../advertDetails/advertDetails';

@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html'
})
export class FavouritePage {
  public adverts: Array<Object>;
  public thisadvert: any;
  constructor(public navCtrl: NavController, private platform: Platform,private storage: Storage) {
this.navCtrl = navCtrl;
  this.platform.ready().then(() => {
        this.storage.keys().then((data) => {
            for(var i = 0; i <= data.length; i++){
                var favourite = data[i];
                this.adverts = [];
                this.storage.get(data[i]).then((val) => {
                    if(val != null){
                        if(val.isFavourite){
                        this.adverts.push(val);
                    }
                    }
                   
                })
               
               
            }
        });
    })
}

viewDetails(advert) {
    this.navCtrl.push(AdvertDetailsPage, advert);
}

}
