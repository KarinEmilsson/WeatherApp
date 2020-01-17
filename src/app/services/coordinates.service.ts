import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {
  url = 'https://photon.komoot.de';
 
  constructor(private http: HttpClient){ }

  searchPlace(search: string): Observable<any> {
    return this.http
        .get(`${this.url}/api/?q=${search}`)
        .pipe(
          retry(3),
          catchError(this.handleError)
        );
  }

  getPlaceFromCoordinates(long: string, lat: string): Observable<any> {
    return this.http
        .get(`${this.url}/reverse?lon=${long}&lat=${lat}`)
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