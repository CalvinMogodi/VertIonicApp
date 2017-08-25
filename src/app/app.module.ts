import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';
import { FavouritePage } from '../pages/favourite/favourite';
import { PostAnAdvertPage } from '../pages/postAnAdvert/postAnAdvert';
import { HelpPage } from '../pages/help/help';
import { ContactUsPage } from '../pages/contactUs/contactUs';
import { PreferedCategoryPage } from '../pages/preferedcatetory/preferedcatetory';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
   apiKey: "AIzaSyBHQX44svGWHFMdmLa2kmD_lhVAm6YC-4I",
    authDomain: "vert-adc31.firebaseapp.com",
    databaseURL: "https://vert-adc31.firebaseio.com",
    projectId: "vert-adc31",
    storageBucket: "vert-adc31.appspot.com",
    messagingSenderId: "55466391699"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    PreferedCategoryPage,
    PostAnAdvertPage,
    HelpPage,
    FavouritePage,
    ContactUsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
   MyApp,
    AboutPage,
    HomePage,
    PreferedCategoryPage,
    PostAnAdvertPage,
    HelpPage,
    FavouritePage,
    ContactUsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

