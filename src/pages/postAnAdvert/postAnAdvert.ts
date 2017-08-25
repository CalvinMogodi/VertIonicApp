import {Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-postAnAdvert',
  templateUrl: 'postAnAdvert.html'
})
export class PostAnAdvertPage {
  public advert = {
     name: undefined,
      category: undefined,
      dateStart: undefined, 
      timeStart: undefined, 
      dateEnd: undefined, 
      timeEnd: undefined, 
      mobileNumber: undefined, 
      emailAddress: undefined, 
      location: undefined, 
      postAsaBusiness: false, 
      businessName: '', 
      businessRegistrationNumber: '', 
      businessWebsite: '', 
      isApproved: false,
  };
  advertForm: FormGroup;
  adverts: FirebaseListObservable<any>;
 formIsSubmitted = false;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,  af: AngularFire, private toastCtrl: ToastController) {
      this.adverts = af.database.list('/avert');
    this.advertForm = this.formBuilder.group({
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
      businessName: [''], 
      businessRegistrationNumber: [''], 
      businessWebsite: [''], 
      isApproved: [false],
      isFreeAdvert: [false],
    });
  }
  
  submit(): void {
      this.formIsSubmitted = false;
      if(this.advertForm.valid){
        this.adverts.push(this.advert);
     
        let toast = this.toastCtrl.create({
          message: 'Advert is added successfully',
          duration: 2000
        });
        toast.present();
      }
  }

isValid(field: string) {
    let formField = this.advertForm.get(field);
    return formField.valid || formField.pristine;
  }

  postAsaBusinessChanged() {
        
    if(!this.advert.postAsaBusiness){
      this.advertForm.controls['businessName'].invalid;   
      this.advertForm.controls['businessRegistrationNumber'].invalid;
       this.advertForm.controls['businessWebsite'].invalid;
    }else{
       this.advertForm.controls['businessName'].valid;   
      this.advertForm.controls['businessRegistrationNumber'].valid;
       this.advertForm.controls['businessWebsite'].valid;
    }
  }


}

//this.firebase.getToken()
  //.then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
  //.catch(error => console.error('Error getting token', error));

//this.firebase.onTokenRefresh()
 // .subscribe((token: string) => console.log(`Got a new token ${token}`));
