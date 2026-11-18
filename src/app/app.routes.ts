import { Routes } from '@angular/router'; // Trae las herramientas de Angular para poder armar el mapa de navegación de la app

export const routes: Routes = [

  {
    path: 'reactive', // Es el detector de URL. Le dice a Angular: "Quédate atento;
    // si el usuario entra a [tusitio.com/reactive](https://tusitio.com/reactive), aplica la regla de abajo"
    loadChildren: () => import('./reactive/reactive.routes').then((m) => m.reactiveRoutes),
    // Con () =>, le dices a Angular: "Guarda esta receta en tu bolsillo y ejecútala únicamente cuando alguien entre a /reactive".

    // import('./reactive/reactive.routes') (El mensajero que busca el archivo)
    // Fíjate que este import() lleva paréntesis, a diferencia del import de la línea 1.
    // Esto se llama importación dinámica. Es como mandar un mensajero por internet a buscar
    // el archivo reactive.routes.ts en ese preciso instante.
    // Como descargar un archivo tarda unos milisegundos,
    // esta instrucción devuelve una Promesa (básicamente dice: "Fui a buscar el archivo;
    // dame un segundo y te aviso cuando vuelva").

    // .then(...) ("Y cuando llegue el archivo, haz esto...")
    // .then() funciona como una sala de espera: se queda quieto hasta que el mensajero regresa con el archivo completo.

    // (m) => m.reactiveRoutes (Abrir la caja y sacar lo que nos sirve)
    // Apenas llega el archivo, .then() ejecuta esa última función flecha
    // (m): Es simplemente una variable corta para módulo (podrías llamarla (archivo) o (paquete)
    // y funcionaría igual). Representa todo el contenido completo del archivo reactive.routes.ts que acaba de descargarse.
    // => m.reactiveRoutes: Dentro de ese archivo podrían existir varias constantes o funciones,
    // pero a Angular solo le interesa la lista de rutas. Con m.reactiveRoutes le dices:
    // "De todo lo que viene dentro del archivo m, saca específicamente la variable exportada
    // llamada reactiveRoutes y úsala".

    // loadChildren significa literalmente "cargar rutas hijas

    // La Función () => es un botón sin apretar.
    // Sirve para guardar código en pausa y decidir cuándo se ejecuta (en este caso, cuando alguien entra a la URL)

    // Callback: Callback (literalmente "llamar de vuelta") es el trabajo que hace: entregarle una función
    // a otro sistema para que él la guarde y decida en qué momento ejecutarla.

    // Es como dejar tu número en un restaurante cuando no hay mesa: tú no te quedas parado en la puerta;
    // le das tu número (la función) y el restaurante te "llama de vuelta" (call back) cuando la mesa está lista.

    //Callback 1 (() => ...): Se lo das al Router de Angular.
    // Angular lo guarda en silencio y lo ejecuta solo cuando el usuario hace clic para ir a /reactive.
    // Callback 2 ((m) => m.reactiveRoutes): Se lo das a .then().
    // Se ejecuta solo cuando el archivo terminó de descargarse por internet.

    // Cada vez que veas que le entregas una función () => ... a otra cosa (a loadChildren,
    // a .then(), a un botón onClick, o a un temporizador setTimeout)
    // en lugar de darle un dato fijo como un texto o un número, estás usando un callback.

  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'country',
    loadChildren: () => import('./country/country.routes').then((m) => m.countryRoutes),
  },
  {
    path: '**',
    redirectTo: 'reactive',
  },
];
