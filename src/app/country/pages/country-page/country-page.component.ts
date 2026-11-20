import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

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
    const countrySubscription = this.onCountryChanged();

    // onCleanup(): Le entrega a Angular una función de limpieza (2ª función flecha).
    // NO se ejecuta al inicio; Angular la guarda y la dispara automáticamente cuando el usuario sale de la pantalla
    // (o justo antes de que el effect vuelva a ejecutarse).
    onCleanup(() => {
      // .unsubscribe() -> "Apaga la radio" y corta la escucha para liberar memoria y evitar procesos fantasma.
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });

  });

  // Método separado para mantener el effect limpio y ordenado:
  onRegionChanged() {

    // 1. this.myForm.get('region')! -> Busca el campo 'region' (el '!' le asegura a TypeScript que sí existe).
    // 2. .valueChanges -> Es un Observable (la estación de radio) que transmite la nueva región cada vez que cambia.
    // 3. .pipe(...) -> Es una "tubería": antes de llegar al .subscribe() final, el dato pasa por varias estaciones en orden.
    return this.myForm.get('region')!.valueChanges
    .pipe(
        // tap(): Ejecuta acciones "de paso" (efectos secundarios) SIN modificar el dato que viaja por la tubería.
        // Es decir, el texto de la 'region' sigue pasando intacto hacia la siguiente estación.

      // ¿Por qué usamos () => ? (Ejecución Diferida / Callback):
      // Le entregamos a RxJS la instrucción "empacada" para que la ejecute SÓLO cuando cambie la región.
      // Si escribiéramos directo: tap( this.myForm...setValue('') ), JavaScript lo ejecutaría
      // inmediatamente al cargar la pantalla, rompiendo el formulario antes de usarlo.

      // Estación 1: Si cambio la región, el país anterior ya no sirve; reseteamos el campo 'country' a vacío.
      tap( () => this.myForm.get('country')!.setValue('')),

      // Estación 2: También reseteamos el campo 'border' (frontera) del formulario.
      tap( () => this.myForm.get('border')!.setValue('')),

      // Estación 3: Vaciamos los Signals (.set([])) para borrar de la pantalla los países y fronteras viejos al instante.
      tap(() => {
        this.borders.set([]);
        this.countriesByRegion.set([]);
      }),

        // switchMap(): Toma el texto de la 'region' y lo CAMBIA por una petición HTTP al servicio para buscar sus países.
        // - Si el usuario cambia de región muy rápido, switchMap CANCELA la petición anterior y se queda solo con la última.
        // - 'region ?? ""' -> Seguro contra nulos: si 'region' llegara a ser null o undefined, envía un texto vacío ''.
      switchMap( region => this.countryService.getCountriesByRegion(region ?? ''))
    )
    // .subscribe(...) -> "Sintoniza" el resultado final de la tubería y devuelve la conexión activa para el onCleanup.
    .subscribe(
        // Este callback se dispara CADA VEZ que el servidor responde con los países de la nueva región.
        // Aquí ya no llega 'region', porque switchMap transformó el dato en la lista de 'countries'.
      (countries) => {
        // Actualizamos el Signal con los países recibidos para que el <select> del HTML se llene automáticamente.
        this.countriesByRegion.set(countries);
      }
    );
  }

  onCountryChanged() {
    return this.myForm.get('country')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('border')!.setValue('')),
      filter(value => value!?.length > 0),
      switchMap( alphacode => this.countryService.getCountryAlphaCode(alphacode ?? '')),
      switchMap( country => this.countryService.getCountryNameByCodeArray(country.borders))
    )
    .subscribe((borders) => {
      console.log({ borders })
    });
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
