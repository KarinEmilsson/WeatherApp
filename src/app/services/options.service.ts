import { Injectable } from '@angular/core';
import { OptionsModel } from '../models/options.model';

@Injectable({
    providedIn: 'root'
  })
export class OptionsService {
    private options: OptionsModel;
  
    constructor() { this.options = new OptionsModel(); this.options.selectedLanguage = 'en'; }

    getSelectedLanguage(): string {
        return this.options.selectedLanguage;
    }
  
    setSelectedLanguage(selLang : string) {
      this.options.selectedLanguage = selLang;
    }
  }