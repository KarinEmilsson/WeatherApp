import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
 
import { WeatherModel, TimeSerie } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point';
 
  constructor(private http: HttpClient) { }

  getWeather(long: string, lat: string): Observable<any> {
    return this.http
        .get(`${this.url}/lon/${long}/lat/${lat}/data.json`)
        .pipe(
          retry(3),
          catchError(this.handleError)
        );
  }

  handleError(error: any) {
    let errorMessage: string;
    // Set error message
    (error.error instanceof ErrorEvent) ?
      errorMessage = error.error.message :
      errorMessage = `Error getting weather: ${error.code}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }
}