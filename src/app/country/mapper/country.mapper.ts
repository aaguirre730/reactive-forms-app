import { Country } from "../interfaces/country.interface";
import { RestCountryObject } from "../interfaces/rest-countries.interface";


export class CountryMapper {
  static mapRestCountryToCountry(restCountry: RestCountryObject): Country {
    return {
      cca3: restCountry.codes.alpha_3,
      borders: restCountry.borders ?? [],
      name: {
        common:
          restCountry.names.translations?.['spa']?.common ?? restCountry.names.common,
        official:
          restCountry.names.translations?.['spa']?.official ?? restCountry.names.official,
        nativeName: restCountry.names.native ?? {},
      }
    }
  };

  static mapRestCountryArray(restCountries: RestCountryObject[]): Country[] {
    return restCountries.map((country) => CountryMapper.mapRestCountryToCountry(country));
  }

}

