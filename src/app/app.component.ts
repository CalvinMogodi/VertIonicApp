import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';
import { PostAnAdvertPage } from '../pages/postAnAdvert/postAnAdvert';
import { HelpPage } from '../pages/help/help';
import { ContactUsPage } from '../pages/contactUs/contactUs';
import { PreferedCategoryPage } from '../pages/preferedcatetory/preferedcatetory';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TabsPage;

   pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.pages = [
      { title: 'Post An AD', component: PostAnAdvertPage, icon: 'add' },
      { title: 'Billboard', component: TabsPage, icon: 'easel' },
      { title: 'Manage Categories', component: PreferedCategoryPage, icon: 'man' },
      { title: 'Contact Us', component: ContactUsPage, icon: 'contacts' },
      { title: 'Help', component: HelpPage, icon: 'help' },
      { title: 'About', component: AboutPage, icon: 'hand' }
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
