import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { PaisSmall, Pais } from '../interfaces/paises.interface';


@Injectable({
  providedIn: 'root'
})
export class PaisesService {


  private baseUrl = 'https://restcountries.com/v2';
  private _regiones =['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones() {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url: string = `${ this.baseUrl }/region/${ region }?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCode( code: string ): Observable<Pais | null> {

    if(!code){
      return of(null)
    }

      const url: string = `${this.baseUrl}/alpha/${ code }`
      return this.http.get<Pais>( url );
  }

  getPaisPorCodeSmall( code: string ): Observable<PaisSmall> {

      const url: string = `${this.baseUrl}/alpha/${ code }?fields=alpha3Code,name`
      return this.http.get<Pais>( url );
  }

  getPaisesPorCodigos( borders: string[]): Observable<PaisSmall[]>{

    if ( !borders ) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodeSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }


}
