import {Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'page-postAnAdvert',
  templateUrl: 'postAnAdvert.html'
})
export class PostAnAdvertPage {
  advert: FormGroup;
  adverts: FirebaseListObservable<any>;
 formIsSubmitted = false;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,  af: AngularFire) {
      this.adverts = af.database.list('/avert');
    this.advert = this.formBuilder.group({
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
      businessName: ['', Validators.required], 
      businessRegistrationNumber: ['', Validators.required], 
      businessWebsite: ['', Validators.required], 
    });
  }

  submit(): void {
     this.formIsSubmitted = false;
      this.adverts.push({
      title: "Testing"
    });

     if(this.advert.valid){

     }
  }

  
    isValid(field: string) {
    let formField = this.advert.get(field);
    return formField.valid || formField.pristine;
  }


}

//this.firebase.getToken()
  //.then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
  //.catch(error => console.error('Error getting token', error));

//this.firebase.onTokenRefresh()
 // .subscribe((token: string) => console.log(`Got a new token ${token}`));
