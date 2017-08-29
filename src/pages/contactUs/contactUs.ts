import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-contactUs',
  templateUrl: 'contactUs.html',
})
export class ContactUsPage {
errorMessageIsHidden = false;
  public message = {
     name: undefined,
    };
    

      contactUsForm: FormGroup;
      messages: FirebaseListObservable<any>;
 formIsSubmitted = false;
 loading: Loading;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, af: AngularFire,public formBuilder: FormBuilder) {
 this.messages = af.database.list('/message');
    this.contactUsForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

   submit(): void {
      this.errorMessageIsHidden = false;
      if(this.contactUsForm.valid){
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
        });
        this.loading.present();
        this.messages.push(this.message);
        this.message.name = '';
        let toast = this.toastCtrl.create({
          message: 'Advert is added successfully',
          duration: 2000
        });
        toast.present();
         this.loading.dismiss();
      }else{
        this.errorMessageIsHidden = true;
      }
   }

  change() {
    // get elements
    var element   = document.getElementById('messageInputBox');
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if(scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height      = scroll_height + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";
}

}
