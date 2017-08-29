import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { App, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public sqlitedb: SQLite

  constructor(public navCtrl: NavController, private sqlite: SQLite) {
     this.sqlite.create({
        name: 'data.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS favourite (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50), category VARCHAR(32), dateStart VARCHAR(15), timeStart VARCHAR(10), dateEnd VARCHAR(15), timeEnd VARCHAR(10), mobileNumber VARCHAR(10), emailAddress VARCHAR(50), location VARCHAR(500), postAsaBusiness bit, businessName VARCHAR(50), businessRegistrationNumber VARCHAR(50), businessWebsite VARCHAR(50), imageRef VARCHAR(50))', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));


  }).catch(e => console.log(e));
  }

 
 likeAdvert(advert){
    let db = new SQLite();
            db.create({
                name: "data.db",
                location: "default"
            }).then((db: SQLiteObject) => {
    db.executeSql('INSERT INTO favourite (' + advert.name + ',' + advert.category + ',' + advert.dateStart +', ' + advert.timeStart  +', ' + advert.dateEnd +', ' + advert.timeEnd +', ' + advert.mobileNumber +', ' + advert.emailAddress +', ' + advert.location +', ' + advert.postAsaBusiness +', ' + advert.businessName+', ' + advert.businessRegistrationNumber +', ' + advert.businessWebsite + ', ' + advert.imageRef + ')', {})
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e));


  }).catch(e => console.log(e));
 }

}
