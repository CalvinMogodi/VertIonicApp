import { Component } from '@angular/core';

import { FavouritePage } from '../favourite/favourite';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FavouritePage;

  constructor() {

  }
}
