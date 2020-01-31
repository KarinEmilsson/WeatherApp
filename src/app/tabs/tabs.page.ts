import { Component } from '@angular/core';
import { OptionsService } from '../services/options.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  tabs: {tab, icon, name}[] = [{
    tab: 'avaluator',
    icon: 'apps',
    name: 'Avaluator'
  },
  {
    tab: 'weather',
    icon: 'flash',
    name: this.optionsService.getSelectedLanguage() == 'sw' ? 'Väder' : 'Weather'
  },
  {
    tab: 'forecast',
    icon: 'send',
    name: this.optionsService.getSelectedLanguage() == 'sw' ? 'Lavinprognos' : 'Avalanche forecast'
  }];

  constructor(private optionsService: OptionsService) { }
}