import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {
  url = 'https://nominatim.openstreetmap.org/';
 
  constructor(private http: HttpClient){ }

  searchPlace(search: string): Observable<any> {
    return this.http
        .get(`${this.url}/search/${search}?format=json`)
        .pipe(
          retry(3),
          catchError(this.handleError)
        );
  }

  getPlaceFromCoordinates(long: string, lat: string): Observable<any> {
    return this.http
        .get(`${this.url}/reverse?format=jsonv2&lat=${lat}&lon=${long}`)
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