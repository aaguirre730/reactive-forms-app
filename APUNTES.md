z# Apuntes y Conceptos Clave: Angular & RxJS

Este documento contiene explicaciones teóricas sobre el comportamiento de RxJS, Angular Signals y JavaScript en el proyecto, para mantener el código fuente limpio y libre de ruido visual.

## 1. Ejecución Diferida y Funciones Flecha `() =>`

En RxJS, al usar operadores como `tap()`, es crucial envolver las instrucciones en una función flecha (un **callback**) para retrasar su ejecución.

### El problema de la ejecución inmediata

Si escribimos el código **SIN** la función flecha:

```typescript
// ❌ MAL: Ejecución inmediata
tap( this.myForm.get('country')!.setValue('') )
```

1. JavaScript lee la línea al cargar el componente.
2. Ve los paréntesis en `setValue('')` y lo ejecuta **inmediatamente**.
3. El campo se borra antes de que el usuario haga nada.
4. `tap` recibe `undefined` (el resultado de `setValue`) y no hace nada cuando el valor realmente cambia.

### La solución: Ejecución Diferida (Callbacks)

Si lo escribimos **CON** la función flecha:

```typescript
// ✅ BIEN: Ejecución diferida
tap( () => this.myForm.get('country')!.setValue('') )
```

1. JavaScript ve la función `() =>` y dice: *"Esto es una receta, no la ejecuto ahora"*.
2. Le entrega esta "caja cerrada" a `tap()`.
3. RxJS guarda la función y la ejecuta **únicamente** cuando un nuevo valor viaja por la tubería (ej. cuando el usuario cambia la región).

**Analogía:** Escribir directo es decirle a la PC "hazlo ya". Usar `() =>` es darle una nota que dice "haz esto solo cuando yo te avise".

---

## 2. Promesas vs Callbacks en RxJS

La función flecha que le pasamos a `tap()` o `subscribe()` actúa como un **Callback** (una función que se pasa como parámetro para ser ejecutada después).

¿Por qué usamos Callbacks/Observables aquí y no Promesas?

* **Promesa:** Sirve para algo que ocurre **una sola vez**. (Ej: "Tráeme los datos de la base de datos y avísame"). Una vez que se cumple, se muere.
* **Callback en RxJS (Observable):** Sirve para un **flujo constante**. El usuario puede cambiar la región 20 veces en la pantalla. RxJS ejecutará nuestro callback 20 veces. Una promesa no serviría porque se agotaría en el primer cambio.

---

## 3. Glosario de Operadores RxJS

* **`tap()`**: Sirve para causar "efectos secundarios". Permite ejecutar acciones de paso (como limpiar un formulario o actualizar un Signal) **SIN** modificar el dato original que viaja por la tubería.
* **`switchMap()`**: Toma el dato actual y lo cambia por un nuevo Observable (ej. una petición HTTP). Es ideal para búsquedas porque **cancela** la petición anterior si el usuario cambia de opción muy rápido, dejando viva solo la última.

---

## 4. Efectos y Limpieza en Angular (`effect`)

```typescript
onFormChanged = effect(( onCleanup ) => {
  const subscription = esteMetodoRetornaUnSubscribe();

  onCleanup(() => {
    subscription.unsubscribe(); // "Apaga la radio"
  });
});
```

* **`effect()`**: Ejecuta su contenido automáticamente apenas arranca el componente y cada vez que cambia un Signal involucrado en su interior.
* **`onCleanup()`**: Es una función de limpieza que Angular guarda. **NO** se ejecuta al inicio. Angular la dispara automáticamente justo cuando el usuario sale de la pantalla (se destruye el componente) o antes de que el efecto se vuelva a ejecutar. Sirve para cancelar suscripciones (`unsubscribe`) y evitar fugas de memoria o procesos fantasma.
