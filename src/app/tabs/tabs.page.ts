import { Component, OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnDestroy {

  subscription: Subscription;
  language: string;
  tabs: { tab, icon, name }[] = [];

  constructor(private optService: OptionsService) { 
    this.subscription = this.optService.options$.subscribe(data => {
      this.language = data.selectedLanguage;
      this.tabs = [{
        tab: 'avaluator',
        icon: 'apps',
        name: 'Avaluator'
      },
      {
        tab: 'weather',
        icon: 'flash',
        name: this.language == 'sw' ? 'Väder' : 'Weather'
      },
      {
        tab: 'forecast',
        icon: 'send',
        name: this.language == 'sw' ? 'Lavinprognos' : 'Avalanche forecast'
      }];
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}