import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { combineLatest, map, Observable, of } from 'rxjs';
import { RESTCountryResponse } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mapper/country.mapper';
import { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountryService {

  // injectamos la herramienta de Angular para hacer peticiones HTTP
  private http = inject(HttpClient);

  headersService = {
    headers: {
      Authorization: `Bearer ${environment.countryToken}`
    }
  }

  private _regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ];

  get regions(): string[] {
    return [... this._regions];
  }

  getCountriesByRegion( region: string): Observable<Country[]> {
    if( !region) return of([]);
    console.log({ region });

    const url = `countries/v5?region=${region}&response_fields=codes.alpha_3,names,borders&limit=100`;

    return this.http.get<RESTCountryResponse>(url, this.headersService)
    .pipe(
      map(restCountries => {
        return CountryMapper.mapRestCountryArray(restCountries.data.objects);
      }),
    );
  }

  getCountryAlphaCode(alphaCode: string): Observable<Country>{

    const url = `/countries/v5/codes.alpha_3/${alphaCode}?response_fields=codes.alpha_3,names,borders`;

    return this.http.get<RESTCountryResponse>(url, this.headersService).pipe(
      map((restCountries) => {
        const restCountry = restCountries.data.objects[0];

        if (!restCountry) {
          throw new Error(`No se encontró ningún país con el código: ${alphaCode}`);
        }

        return CountryMapper.mapRestCountryToCountry(restCountry);
      })
    );
  }

  getCountryNameByCodeArray(countryCodes: string[]): Observable<Country[]> {
    if( !countryCodes || countryCodes.length === 0) return of([]);
    const countriesRequests: Observable<Country>[] = [];
    countryCodes.forEach( code => {
      const request = this.getCountryAlphaCode(code);
      countriesRequests.push(request);
    })
    // combineLatest: combina todas las peticiones en una sola
    // y espera que todas cumplan de forma exitosa,
    // si una falla el Observable falla en su totalidad
    return combineLatest( countriesRequests);
  }

}
