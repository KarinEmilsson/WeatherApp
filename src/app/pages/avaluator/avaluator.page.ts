import { Component } from '@angular/core';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-avaluator',
  templateUrl: 'avaluator.page.html',
  styleUrls: ['avaluator.page.scss']
})
export class AvaluatorPage {
  private countAvalanceConditions: number = 0;
  private countTerrainCharacteristics: number = 0;
  thisId = '0-0';
  counter: number = 0;
  eval: string = "Caution";
  evalStyle: string = "#424242";
  degrees1pChecked = false;
  degrees2pChecked = false;

  private setHeader() {
    switch(this.thisId)
        {
          case "0-0": case "0-1": case "0-2": case "0-3": case "0-4": case "1-0": case "1-1": case "2-0": case "3-0": case "4-0":
            this.eval = "Caution"
            this.evalStyle = "#424242"
            break;
          case "0-5": case "1-2": case "1-3": case "1-4": case "1-5": case "2-1": case "2-2": case "2-3": case "2-4": case "3-1": case "3-2": case "3-3": case "3-4": case "4-1": case "4-2": case "5-0": case "5-1":
            this.eval = "Extra Caution"
            this.evalStyle = "orange"
            break;
          case "0-5": case "2-5": case "3-4": case "3-5": case "4-3": case "4-4": case "4-5": case "5-2": case "5-3": case "5-4": case "5-5": case "6-0": case "6-1": case "6-2": case "6-3": case "6-4": case "6-5":
            this.eval = "NOT RECOMMENDED"
            this.evalStyle = "red"
            break;
          default:
            this.eval = "Caution"
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

  constructor() {}

}
