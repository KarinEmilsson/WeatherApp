import { Component } from '@angular/core';
import { OptionsService } from '../../services/options.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avaluator',
  templateUrl: 'avaluator.page.html',
  styleUrls: ['avaluator.page.scss']
})
export class AvaluatorPage {

  private countAvalanceConditions: number = 0;
  private countTerrainCharacteristics: number = 0;
  subscription: Subscription;
  thisId = '0-0';
  counter: number = 0;
  eval: string = "Caution";
  evalsw: string = "Uppmärksamhet";
  evalStyle: string = "#424242";
  degrees1pChecked = false;
  degrees2pChecked = false;
  language: string;

  constructor(private optService : OptionsService) {
    this.subscription = this.optService.options$.subscribe(data => {
      this.language = data.selectedLanguage;
    });
  }

  setLanguage(lang: string) { this.optService.setSelectedLanguage(lang); }

  private setHeader() {
    switch(this.thisId)
        {
          case "0-0": case "0-1": case "0-2": case "0-3": case "0-4": case "1-0": case "1-1": case "2-0": case "3-0": case "4-0":
            this.eval = "Caution"
            this.evalsw = "Uppmärksamhet"
            this.evalStyle = "#424242"
            break;
          case "0-5": case "1-2": case "1-3": case "1-4": case "1-5": case "2-1": case "2-2": case "2-3": case "2-4": case "3-1": case "3-2": case "3-3": case "3-4": case "4-1": case "4-2": case "5-0": case "5-1":
            this.eval = "Extra Caution"
            this.evalsw = "Extra Uppmärksamhet"
            this.evalStyle = "orange"
            break;
          case "0-5": case "2-5": case "3-4": case "3-5": case "4-3": case "4-4": case "4-5": case "5-2": case "5-3": case "5-4": case "5-5": case "6-0": case "6-1": case "6-2": case "6-3": case "6-4": case "6-5":
            this.eval = "NOT RECOMMENDED"
            this.evalsw = "INTE rekommenderat"
            this.evalStyle = "red"
            break;
          default:
            this.eval = "Caution"
            this.evalsw = "Uppmärksamhet"
            break;
        }
  }
  
  upAvalanceConditions(e, p)
  {
    if(e.currentTarget.checked) {
      this.countAvalanceConditions = this.countAvalanceConditions + p;} 
    else
      this.countAvalanceConditions = this.countAvalanceConditions - p;

      this.counter = this.countAvalanceConditions + this.countTerrainCharacteristics;

      this.thisId = this.countAvalanceConditions + "-" + this.countTerrainCharacteristics;
      this.setHeader();
  }

  upTerrainCharacteristics(e, p)
  {
   if(e.currentTarget.checked)
      this.countTerrainCharacteristics = this.countTerrainCharacteristics + p;
    else
      this.countTerrainCharacteristics = this.countTerrainCharacteristics - p;

      this.counter = this.countAvalanceConditions + this.countTerrainCharacteristics;
      
      this.thisId = this.countAvalanceConditions + "-" + this.countTerrainCharacteristics;
      this.setHeader();

      if(e.currentTarget.id == "degrees1p" && e.currentTarget.checked && this.degrees2pChecked) {
        this.degrees2pChecked = false;
      }
      if(e.currentTarget.id == "degrees2p" && e.currentTarget.checked && this.degrees1pChecked)
      {
        this.degrees1pChecked = false;
      }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
