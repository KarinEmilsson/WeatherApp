import { WeatherService } from '../../services/weather.service';
import { WeatherModel } from '../../models/weather.model';
import { PrecipitationCategories } from '../../models/precipitationCategories.enum';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: 'weather.page.html',
  styleUrls: ['weather.page.scss']
})
export class WeatherPage implements OnInit {
  
  crd = 'Åre';
  coordinates = [{city: 'Åre', coord: '13.055;63.409'}, {city: 'Hamburg', coord: '9.994;53.551'}];
  search: Observable<any>;
  weather: WeatherModel;

  constructor(private weatherService: WeatherService, private elementRef: ElementRef) {
    this.getWeather();
   }

  get precipitationCategories() { return PrecipitationCategories; }
  
  getWeather() {
    let coord = this.coordinates.filter(item => item.city == this.crd)[0]; 

    if(coord) {
      this.weatherService.getWeather(coord.coord.split(";")[0], coord.coord.split(";")[1]).subscribe(result => {
        if(result) {
          this.weather = result;

          this.setTempGraph();
          this.setWindGraph();
          this.setRainGraph();
        }
      });
    }
  }

  private setTempGraph() {
    let weatherChartTempCanvas = this.elementRef.nativeElement.querySelector('#weatherChartTempCanvas');
    new Chart(weatherChartTempCanvas, {
      type: "line",
      data: {
        labels: this.weather.timeSeries.map(item => '-'),//item.validTime[0]),
        datasets: [
          {
            label: 'Temp (*C)                                       ',
            data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 't').map(temp => temp.values[0])[0]),
            borderColor: "pink",
            fill: false,
            pointRadius: 2
          }
        ],
        fill: false
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        }
      } 
    });
  }

  private setWindGraph() {
    let weatherChartWindCanvas = this.elementRef.nativeElement.querySelector('#weatherChartWindCanvas');
    
    new Chart(weatherChartWindCanvas, {
      type: "line",
      data: {
        labels: this.weather.timeSeries.map(item => '-'),//item.validTime[0]),
        datasets: [
          {
            label: 'Wind min (m/s)                               ',
            data: this.weather.timeSeries.map(
              item => item.parameters.filter(p => p.name == 'ws').map(temp => temp.values[0])[0]),
            borderColor: "grey",
            fill: false,
            pointRadius: 2
          },
          {
            label: 'Arrows: Dir and wind max (m/s)     ',
            data: this.weather.timeSeries.map(
              item => item.parameters.filter(p => p.name == 'gust').map(temp => temp.values[0])[0]),
            fill: false,
            showLine: false,
            pointStyle: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'wd').map(wd => this.setWindIcon(wd.values[0]))[0])
          }
        ]
      },
      options: {
        responsive: true,
          legend: {
            position: 'bottom',
          }
      } 
    });
  }

  private setRainGraph() {
    let weatherChartRainCanvas = this.elementRef.nativeElement.querySelector('#weatherChartRainCanvas');
    new Chart(weatherChartRainCanvas, {
      type: "line",
      data: {
        labels: this.weather.timeSeries.map(item => '-'),//item.validTime[0]),
        datasets: [
          {
            label: 'Precipitation min (mm)                  ',
            data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'pmin').map(temp => temp.values[0])[0]),
            borderColor: "blue",
            fill: false,
            pointRadius: 2
          },
          {
            label: 'Icons: Precip. type and max (mm)',
            data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'pmax').map(temp => temp.values[0])[0]),
            borderColor: "lightblue",
            fill: false,
            showLine: false,
            pointRadius: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'pcat').map(pcat => this.setPrecipIconRadius(pcat.values[0]))[0]),
            pointStyle: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'pcat').map(pcat => this.setPrecipIcon(pcat.values[0]))[0])
          }
        ],
        fill: false
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        }
      } 
    });
  }

  private setWindIcon(dir: number)
  {
    var N = new Image();
    N.src = '../../../assets/icon/N.png';
    N.height = 5;
    N.width = 4;
    var NE = new Image();
    NE.src = '../../../assets/icon/NE.png';
    NE.height = 5;
    NE.width = 4;
    var E = new Image();
    E.src = '../../../assets/icon/E.png';
    E.height = 5;
    E.width = 4;
    var SE = new Image();
    SE.src = '../../../assets/icon/SE.png';
    SE.height = 5;
    SE.width = 4;
    var S = new Image();
    S.src = '../../../assets/icon/S.png';
    S.height = 5;
    S.width = 4;
    var SW = new Image();
    SW.src = '../../../assets/icon/SW.png';
    SW.height = 5;
    SW.width = 4;
    var W = new Image();
    W.src = '../../../assets/icon/W.png';
    W.height = 5;
    W.width = 4;
    var NW = new Image();
    NW.src = '../../../assets/icon/NW.png';
    NW.height = 5;
    NW.width = 4;

    if(dir >= 0 && dir <= 22 || dir >= 338 && dir <= 360) {
      return N;
    }      
    if(dir >= 23 && dir <= 67) {
      return NE;
    } 
    if(dir >= 68 && dir <= 112) {
      return E;
    } 
    if(dir >= 113 && dir <= 157) {
      return SE;
    } 
    if(dir >= 158 && dir <= 202) {
      return S;
    } 
    if(dir >= 203 && dir <= 247) {
      return SW;
    } 
    if(dir >= 248 && dir <= 292) {
      return W;
    }
    if(dir >= 293 && dir <= 337) {
      return NW;
    } 
  }

  setPrecipIcon(pcat: PrecipitationCategories) {
    console.log(pcat);
    switch(pcat)
    {
      case PrecipitationCategories.Snow: 
        return 'star';
        break;
      case PrecipitationCategories["Snow and rain"]: 
        return 'cross';
        break;
      case PrecipitationCategories.Rain: 
        return 'circle';
        break;
      case PrecipitationCategories["Freezing rain"]: 
        return 'triangle';
        break;
      case PrecipitationCategories["Freezing drizzle"]: 
        return 'rectRot';
        break;
      case PrecipitationCategories.Drizzle: 
        return 'rectRounded';
        break;  
      default: 
        return 'circle';
        break;
    }
  }

  setPrecipIconRadius(pcat: PrecipitationCategories) {
    switch(pcat)
    {
      case PrecipitationCategories.Rain: 
        return 3;
        break;
      case PrecipitationCategories["No precipitation"]:
        return 2;
        break;
      default: 
        return 4;
        break;
    }
  }

  ngOnInit() { }
}
