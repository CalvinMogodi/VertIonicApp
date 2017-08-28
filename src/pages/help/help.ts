import { Component } from '@angular/core';
import { NavController , LoadingController, Loading, AlertController} from 'ionic-angular';
import {AngularFire, FirebaseListObservable, AngularFireDatabase} from 'angularfire2';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {
   loading: Loading;
 FAQs: Array<any>;
  constructor(public navCtrl: NavController,  af: AngularFire, public afDatabase: AngularFireDatabase,public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    //this.FQAs = afDatabase.list('/message');
     this.loading = this.loadingCtrl.create({
    content: 'Please wait...',
  });
  this.loading.present();
    this.afDatabase.list('/FAQ').subscribe(data => {
      this.FAQs = data;
      this.loading.dismiss();
    })
  }

  showAlert(item) {
    let alert = this.alertCtrl.create({
      title: item.question,
      subTitle: item.answer,
      buttons: ['OK']
    });
    alert.present();
  }

}
