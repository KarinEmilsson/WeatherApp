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

  weatherDates: any;
  weatherTemp: any;
  weatherWindMin: any;
  weatherWindMax: any;
  weatherRain: any;
  weatherPrecipitationCategory: any;

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

        this.weatherDates = this.weather.timeSeries.map(
          item => item.validTime);
        this.weatherTemp = this.weather.timeSeries.map(
          item => item.parameters.filter(p => p.name == 't').map(temp => temp.values[0])[0])
        this.weatherWindMin = this.weather.timeSeries.map(
          item => item.parameters.filter(p => p.name == 'ws').map(temp => temp.values[0])[0])
        this.weatherWindMax = this.weather.timeSeries.map(
          item => item.parameters.filter(p => p.name == 'gust').map(temp => temp.values[0])[0])
        this.weatherRain = this.weather.timeSeries.map(
          item => item.parameters.filter(p => p.name == 'pmax').map(temp => temp.values[0])[0])
        this.weatherPrecipitationCategory = this.weather.timeSeries.map(
          item => item.parameters.filter(p => p.name == 'pcat').map(temp => temp.values[0])[0])

        let weatherChartTempCanvas = this.elementRef.nativeElement.querySelector('#weatherChartTempCanvas');
        new Chart(weatherChartTempCanvas, {
          type: "bar",
          data: {
            labels: this.weather.timeSeries.map(item => '-'),//item.validTime[0]),
            datasets: [
              {
                label: 'Temp (*C)',
                data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 't').map(temp => temp.values[0])[0]),
                backgroundColor: "lightblue",
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

        let weatherChartWindCanvas = this.elementRef.nativeElement.querySelector('#weatherChartWindCanvas');
        new Chart(weatherChartWindCanvas, {
          type: "bar",
          data: {
            labels: this.weather.timeSeries.map(item => '-'),//item.validTime[0]),
            datasets: [
              {
                label: 'Wind (m/s)',
                data: this.weather.timeSeries.map(
                  item => item.parameters.filter(p => p.name == 'ws').map(temp => temp.values[0])[0]),
                backgroundColor: "pink",
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

        let weatherChartRainCanvas = this.elementRef.nativeElement.querySelector('#weatherChartRainCanvas');
        new Chart(weatherChartRainCanvas, {
          type: "bar",
          data: {
            labels: this.weather.timeSeries.map(item => '-'),//item.validTime[0]),
            datasets: [
              {
                label: 'Precipitation max (mm)',
                data: this.weather.timeSeries.map(item => item.parameters.filter(p => p.name == 'pmax').map(temp => temp.values[0])[0]),
                backgroundColor: "blue",
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
    });
  }
  }


  ngOnInit() { }
}
