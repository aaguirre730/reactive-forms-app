import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {

  fb = inject(FormBuilder);

  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);

  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  // effect(): Ejecuta automáticamente la 1ª función flecha apenas arranca el componente.
  // Angular nos entrega 'onCleanup' como parámetro para limpiar todo cuando salgamos de esta pantalla.
  onFormChanged = effect(( onCleanup ) => {

    // Llama al método de abajo para encender el "espía" de la región.
    // Guarda la conexión activa (Subscription) en 'regionSubscription' para poder apagarla después.
    const regionSubscription = this.onRegionChanged();

    // onCleanup(): Le entrega a Angular una función de limpieza (2ª función flecha).
    // NO se ejecuta al inicio; Angular la guarda y la dispara automáticamente cuando el usuario sale de la pantalla
    // (o justo antes de que el effect vuelva a ejecutarse).
    onCleanup(() => {
      // .unsubscribe() -> "Apaga la radio" y corta la escucha para liberar memoria y evitar procesos fantasma.
      regionSubscription.unsubscribe();
    });

  });

  // Método separado para mantener el effect limpio y ordenado:
  onRegionChanged() {

    // 1. this.myForm.get('region')! -> Busca el campo 'region' (el '!' le asegura a TypeScript que sí existe).
    // 2. .valueChanges -> Es un Observable (como una estación de radio) que transmite cada vez que cambia el campo.
    // 3. .subscribe(...) -> "Sintoniza" esa radio y devuelve la conexión activa (return) para que 'effect' la guarde.
    return this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('')),
      tap( () => this.myForm.get('border')!.setValue('')),
      tap(() => {
        this.borders.set([]);
        this.countriesByRegion.set([]);
      }),
      switchMap( region => this.countryService.getCountriesByRegion(region ?? ''))
    )
    .subscribe(
      // Este callback (3ª función flecha) se dispara CADA VEZ que el usuario elige otra región.
      // 'region' trae el nuevo dato elegido.
      (countries) => {
        this.countriesByRegion.set(countries);
      }
    );
  }

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  // inconveniente: hay que quitar la suscripción cuando terminemos
  //formRegionChanged = this.myForm.get('region')!.valueChanges.subscribe((value) => {
  //  console.log({ value });
  //});

}
