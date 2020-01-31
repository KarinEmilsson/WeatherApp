import { Injectable } from '@angular/core';
import { OptionsModel } from '../models/options.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class OptionsService {
  private options = new BehaviorSubject<OptionsModel>(new OptionsModel());
  options$ = this.options.asObservable();

  constructor() { this.options.next({ selectedLanguage: 'sw'}); }

  setSelectedLanguage(selLang : string) {
    this.options.next({ selectedLanguage: selLang });
  }
}