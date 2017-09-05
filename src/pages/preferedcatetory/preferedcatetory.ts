import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { App, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-preferedcategory',
  templateUrl: 'preferedcategory.html'
})

export class PreferedCategoryPage {
  public catagories = [
       {name: "Adventure Or Theme Park", isActive :false},
       {name: "Art", isActive :false},
       {name: "Bar Club Or Pub", isActive :false},
       {name: "Beauty And Spa", isActive :false},
       {name: "Cars", isActive :false},
       {name: "Fashion", isActive :false},
       {name: "Games", isActive :false},
       {name: "Health", isActive :false},
       {name: "Hotel Or Casino", isActive :false},
       {name: "Investor Or Bank", isActive :false},
       {name: "Mall Or Shopping Center", isActive :false},
       {name: "Music And Radio", isActive :false},
       {name: "Restaurant Or Gas Station", isActive :false},
       {name: "Software And Technology", isActive :false},
       {name: "Sport", isActive :false},
       {name: "Supermarket", isActive :false},
       {name: "Travel", isActive :false},
       {name: "Theater", isActive :false},
       {name: "Wholesale And Hardware", isActive :false}]

  constructor(public navCtrl: NavController,private storage: Storage) {
  this.storage.get("catagories").then((val) => {
      if(val != null){
        this.catagories = val;
      }});
  }

  saveCategory(catagory){    
     this.storage.set("catagories", this.catagories);
  }

}
