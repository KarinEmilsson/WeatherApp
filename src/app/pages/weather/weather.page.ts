import { WeatherService } from '../../services/weather.service';
import { CoordinatesService } from '../../services/coordinates.service';
import { WeatherModel } from '../../models/weather.model';
import { PlaceModel } from '../../models/place.model';
import { PrecipitationCategories } from '../../models/precipitationCategories.enum';
import { WeatherSymbols } from '../../models/weatherSymbols.enum';
import { OptionsService } from '../../services/options.service';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-weather',
  templateUrl: 'weather.page.html',
  styleUrls: ['weather.page.scss']
})
export class WeatherPage implements OnInit, OnDestroy {
  
  subscription: Subscription;
  searchedPlace = '';
  searchedPlaces: { name, coords }[] = [];
  coord = '13.011;63.423';
  weather: WeatherModel;
  language: string;

  weatherChart;
  weatherWindChart;
  weatherPrecipChart;

  places = [
    { coord: '18.723;68.361', place: 'Abiskofjällen'},
    { coord: '18.112;68.422', place: 'Riksgränsenfjällen'},
    { coord: '18.586;67.878', place: 'Kebnekaisefjällen'},
    { coord: '15.301;65.925', place: 'Västra Vindelfjällen'},
    { coord: '15.494;65.143', place: 'Södra Lapplandsfjällen'},
    { coord: '13.011;63.423', place: 'Södra Jämtlandsfjällen'},
    { coord: '12.455;62.747', place: 'Västra Härjedalsfjällen'}
  ];

  constructor(/*private geolocation : Geolocation, */
    private weatherService: WeatherService, 
    private coordinatesService: CoordinatesService, 
    private elementRef: ElementRef, 
    private optService: OptionsService) 
    {
      this.subscription = this.optService.options$.subscribe(data => {
        this.language = data.selectedLanguage;
        this.getWeather(); 
      });
      this.getLocationAndWeather();
    }

  setLanguage(lang: string) { this.optService.setSelectedLanguage(lang); }
  get precipitationCategories() { return PrecipitationCategories; }
  get weatherSymbols() { return WeatherSymbols; }

  getLocationAndWeather() {
    this.searchedPlaces = [];
    //this.geolocation.getCurrentPosition((resp) => {
    navigator.geolocation.getCurrentPosition((resp) => {
      let lon : string = resp.coords.longitude + '';
      let lat : string = resp.coords.latitude + '';
      this.coord = lon.slice(0, 6) + ';' + lat.slice(0, 6);
      this.getPlace();
      this.getWeather();
    }, (error: any) => {
      let errorMessage: string;
      // Set error message
      (error.error instanceof ErrorEvent) ?
        errorMessage = error.error.message :
        errorMessage = `Error getting location: ${error.code}\nMessage: ${error.message}`;
      // console.log(errorMessage);
    });
  }

  getPlace() {
    this.coordinatesService.getPlaceFromCoordinates(this.coord.split(";")[0], this.coord.split(";")[1]).subscribe(result => {
      if(result) {
        let r: PlaceModel = result;
        if(r && r.features && r.features.length > 0) {
          this.searchedPlace = r.features[0].properties.name + ', ' + r.features[0].properties.state + ', ' + r.features[0].properties.name;
        }
    }
    }, error => { /*console.log(error)*/; });
  }

  searchPlace(e) {
    this.searchedPlaces = [];
    this.coordinatesService.searchPlace(e.currentTarget.value).subscribe(result => {
      if(result) {
        let r: PlaceModel = result;
        if(r && r.features && r.features.length > 0) {
          let swedishResult = r.features.filter(s => s.properties.country == "Sweden");
          if(swedishResult && swedishResult.length > 0) {
            if(swedishResult.length == 1) {
              this.coord = swedishResult[0].geometry.coordinates[0].toString().substring(0, 6) + ';' + swedishResult[0].geometry.coordinates[1].toString().substring(0, 6);
              this.getWeather();
              this.searchedPlace = swedishResult[0].properties.name + ', ' + swedishResult[0].properties.state + ', ' + swedishResult[0].properties.name;
            }
            else {
                swedishResult.forEach(element => {
                  this.searchedPlaces.push({ name: element.properties.name + ', ' + element.properties.state + ', ' + element.properties.name, coords: element.geometry.coordinates[0].toString().substring(0, 6) + ';' + element.geometry.coordinates[1].toString().substring(0, 6)});
              });
            }
          }
          else this.searchedPlace = 'No search result'
        }
      }
    }, error => { /*console.log(error)*/; });
  }

  selectSearchedPlace(name: string, coords: string) {
    this.coord = coords;
    this.searchedPlace = name;
    this.getWeather();
    this.searchedPlaces = [];
  }

  getWeatherFromDd(e) { 
    this.searchedPlaces = [];
    let checkIfChangedValueIsChangedFromDropDown = this.places.filter(p => p.coord == e.currentTarget.value)[0]; 
    if(checkIfChangedValueIsChangedFromDropDown) {
      this.searchedPlace = '';
     this.getWeather(); 
    }
  }

  getWeather() {
      this.weatherService.getWeather(this.coord.split(";")[0], this.coord.split(";")[1]).subscribe(result => {
      if(result) {
        let r: WeatherModel = result;
        if(r) {
          this.weather = new WeatherModel();
          this.weather.timeSeries = r.timeSeries.slice(0, 34);

          this.setTempGraph();
          this.setWindGraph();
          this.setRainGraph();
        }
      }
    }, error => { /*console.log(error)*/; });
  }

  private setTempGraph() {
    if(this.weatherChart) this.weatherChart.destroy();

    let weatherChartTempCanvas = this.elementRef.nativeElement.querySelector('#weatherChartTempCanvas');
    this.weatherChart = new Chart(weatherChartTempCanvas, {
      type: "line",
      data: {
        labels: this.weather.timeSeries.map(item => moment(item.validTime).format('DD HH\'')),
        datasets: [
          {
            label: 'Temp (°C)                                            ',
            data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 't').map(temp => temp.values[0])[0]),
            borderColor: "pink",
            fill: false,
            pointRadius: 2
          },
          {
            label: this.language == 'en' ? 
            'No weather icon - see precip. graph' :
            'Ingen väderikon - se nederb. grapg ',
            data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 't').map(temp => temp.values[0])[0] + 2),
            fill: false,
            showLine: false,
            pointStyle: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'Wsymb2').map(Wsymb2 => this.setWeatherSymbol(Wsymb2.values[0]))[0]),
            pointRadius: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'Wsymb2').map(Wsymb2 => this.setWeatherSymbol(Wsymb2.values[0]))[0] == 'circle' ? 0 : 0)
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
    if(this.weatherWindChart) this.weatherWindChart.destroy();

    let weatherChartWindCanvas = this.elementRef.nativeElement.querySelector('#weatherChartWindCanvas');
    this.weatherWindChart = new Chart(weatherChartWindCanvas, {
      type: "line",
      data: {
        labels: this.weather.timeSeries.map(item => moment(item.validTime).format('DD. HH\'')),
        datasets: [
          {
            label: this.language == 'en' ? 
              'Wind min (m/s)                                 ' : 
              'Vind min (m/s)                                 ',
            data: this.weather.timeSeries.map(
              item => item.parameters.filter(p => p.name == 'ws').map(temp => temp.values[0])[0]),
            borderColor: "grey",
            fill: false,
            pointRadius: 2
          },
          {
            label: this.language == 'en' ? 
            'Arrows: Dir and wind max (m/s)     ' : 
            'Pilar: Riktning och vind max (m/s) ',
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
    if(this.weatherPrecipChart) this.weatherPrecipChart.destroy();

    let weatherChartRainCanvas = this.elementRef.nativeElement.querySelector('#weatherChartRainCanvas');
    this.weatherPrecipChart = new Chart(weatherChartRainCanvas, {
      type: "line",
      data: {
        labels: this.weather.timeSeries.map(item => moment(item.validTime).format('DD. HH\'')),
        datasets: [
          {
            label: this.language == 'en' ? 
            'Precipitation min (mm)                   ' : 
            'Nederbörd min (m/s)                        ',
            data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'pmin').map(temp => temp.values[0])[0]),
            borderColor: "blue",
            fill: false,
            pointRadius: 2
          },
          {
            label: this.language == 'en' ? 
            'Icons: Precip. type and max (mm) ' : 
            'Ikoner: Typ av nedb. och max (mm)',
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
    N.height = 6;
    N.width = 6;
    var NE = new Image();
    NE.src = '../../../assets/icon/NE.png';
    NE.height = 6;
    NE.width = 6;
    var E = new Image();
    E.src = '../../../assets/icon/E.png';
    E.height = 6;
    E.width = 6;
    var SE = new Image();
    SE.src = '../../../assets/icon/SE.png';
    SE.height = 6;
    SE.width = 6;
    var S = new Image();
    S.src = '../../../assets/icon/S.png';
    S.height = 6;
    S.width = 6;
    var SW = new Image();
    SW.src = '../../../assets/icon/SW.png';
    SW.height = 6;
    SW.width = 6;
    var W = new Image();
    W.src = '../../../assets/icon/W.png';
    W.height = 6;
    W.width = 6;
    var NW = new Image();
    NW.src = '../../../assets/icon/NW.png';
    NW.height = 6;
    NW.width = 6;

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
      case PrecipitationCategories.Rain: case PrecipitationCategories["No precipitation"]:
        return 2;
        break;
      default: 
        return 4;
        break;
    }
  }

  setWeatherSymbol(symb: WeatherSymbols) {
    var Clear = new Image();
    Clear.src = '../../../assets/icon/Clear.png';
    Clear.height = 9;
    Clear.width = 9;
    var Cloudy = new Image();
    Cloudy.src = '../../../assets/icon/Cloudy.png';
    Cloudy.height = 9;
    Cloudy.width = 9;
    var Fog = new Image();
    Fog.src = '../../../assets/icon/Fog.png';
    Fog.height = 9;
    Fog.width = 9;
    var Halfclear = new Image();
    Halfclear.src = '../../../assets/icon/Halfclear.png';
    Halfclear.height = 9;
    Halfclear.width = 9;
    var NearlyClear = new Image();
    NearlyClear.src = '../../../assets/icon/NearlyClear.png';
    NearlyClear.height = 9;
    NearlyClear.width = 9;
    var Overcast = new Image();
    Overcast.src = '../../../assets/icon/Overcast.png';
    Overcast.height = 9;
    Overcast.width = 9;
    var Thunder = new Image();
    Thunder.src = '../../../assets/icon/Thunder.png';
    Thunder.height = 9;
    Thunder.width = 9;
    var Thunderstorm = new Image();
    Thunderstorm.src = '../../../assets/icon/Thunderstorm.png';
    Thunderstorm.height = 9;
    Thunderstorm.width = 9;
    var Variable = new Image();
    Variable.src = '../../../assets/icon/Variable.png';
    Variable.height = 9;
    Variable.width = 9;
    
    switch(symb)
    {
      case WeatherSymbols["Clear sky"]: 
        return Clear;
        break;
      case WeatherSymbols["Cloudy sky"]: 
        return Cloudy;
        break;
      case WeatherSymbols.Fog: 
        return Fog;
        break;
      case WeatherSymbols["Halfclear sky"]: 
        return Halfclear;
        break;
      case WeatherSymbols["Nearly clear sky"]: 
        return NearlyClear;
        break;
      case WeatherSymbols.Overcast: 
        return Overcast;
        break; 
        case WeatherSymbols.Thunder: 
        return Thunder;
        break; 
        case WeatherSymbols.Thunderstorm: 
        return Thunderstorm;
        break; 
        case WeatherSymbols["Variable cloudiness"]: 
        return Variable;
        break;  
      default: 
        return 'circle';
        break;
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
