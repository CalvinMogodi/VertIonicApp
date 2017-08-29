import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html'
})
export class FavouritePage {
  public database: SQLite;
  public adverts: Array<Object>;

  constructor(public navCtrl: NavController, private platform: Platform) {

  this.platform.ready().then(() => {
 let database = new SQLite();
            database.create({
                name: "data.db",
                location: "default"
            }).then((database: SQLiteObject) => {
    database.executeSql("SELCT * FROM people", {}).then((data) => {
                 this.adverts = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.adverts.push({firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname});
                }
            }
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
            }, (error) => {
                console.error("Unable to open database: ", error);
                  });
  })}

  

}
