# Controllers #

La capa de controllers es responsable de manejar las peticiones entrantes (mayoritariamente HTTP).

![controllers](imgs/Controllers_1.png)

Para decirle a Nest que `CatsController` es un controller, se debe agregar `metadata` a la clase. Esto se hace usando `decorators`.

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return [];
  }
}
```

## Metadata ##

En el ejemplo de arriba utilizamos `@Controller('cats')`. Este decorator es obligatory. El `cats` es un prefijo  para cada ruta en la clase. Si bien es opcional reduce la reduncancia en código repetitivo. por lo que no tienes por qué repetirte cada vez que decides hacer un endpoint nuevo.  
Hay también en este ejemplo un método público llamado `findAll()`, el cual retorna un array vacío. El decorator `@Get()` le dice a Nest que es necesario crear un enpoint para esta ruta, y mapea cada request a este `handler`.  
Dado que declaramos el prefijo `cats` para cada ruta, Nest mapeará cada petición GET con `/cats` aquí.  

Cuando el cliente llame a este endpoint, Nest retornará un status 200, y el `JSON` parseado - un array vacío en este ejemplo. ¿Cómo es posible?  

Hay dos posibles enfoques para manipular la respuesta:

* `Standard` (Recomendado)  
En este enfoque se trata a los `handlers` de la misma forma que a una función plana. Cuando retornamos un objeto JavaScript o un array, éste será `automáticamente transformado a JSON`. Cuando retornamos un string, Nest enviará simplemente un string.      
Es más, el `status code` de la respuesta siempre es `200` por defecto, excepto cuando la petición es POST, en este caso será `201`. Podemos cambiar el status code fácilmente a con decorators, añadiendo `@HttpCode(...)` a nivel del handler.

* Express
Podemos usar el `response object` de Express, el cúal se  utiliza inyectando el decorator `@Res()` en la firma de la función handler. Por ejemplo `findAll(@Res() response)`

__AVISO!__  
Está prohibido usar ambos enfoques al mismo tiempo. Nest detecta si el handler están utilizando `@Rest()`, y si esto es así la forma standard se deshabilita para esta ruta.

## Request object ##

Muchos de los endpoints necesitan un acceso al detalle de la request que manda el cliente. De hecho, Nest usa el `request object` de Express. Podemos forcar a Nest a inyectar el request object dentro del handler utilizando el decorator `@Req()`.

__PISTA!__  
Hay un paquete `@types/express` que recomendamos que utilicen firmemente.

```
import { Controller, Get, Req } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request) {
    return [];
  }
}
```

El `request object` contiene headers, params y cuerpo de la petición, pero en la mayoría de los casos no es necesario agarrarlos manualmente. Podemos usar `decorators dedicados`, como `@Body()` o `@Query`, disponibles "out of the box". Debajo se encuentra una comparación de los decorators con los objetos planos de express.

|        Nest              |                Express           |
|:------------------------:|:--------------------------------:|
| @Request()               | req                              |
| @Response()              | res                              |
| @Next()                  | next                             |
| @Session()               | req.session                      |
| @Param(param?: string)   | req.params / req.params[param]   |
| @Body(param?: string)    | req.body / req.body[param]       |
| @Query(param?: string)   | req.query / req.query[param]     |
| @Headers(param?: string) | req.headers / req.headers[param] |

## Más endpoints ##

Ya hemos creado un endpoint apra traer datos. Sería genial proveer una forma de crear nuevos registros también. Entonces... ¿qué estamos esperando? creemos un handler para `POST`.

```ts
import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create() {
    // TODO: Add some logic here
  }

  @Get()
  findAll() {
    return [];
  }
}
```

Es realmente simple. Nest provee de los decorators de la misma manera - `@Put()`, `@Delete()`, etc..

## Async / await ##

Amamos al JavaScript moderno, y sabemos que la extracción de datos es mayoritariamente asíncrona. Esa es la razón por la cual Nest soporta funciones `async`, y funciona muy bien con ellas.

__PISTA__
Puedes aprender más de async/await [aquí](https://kamilmysliwiec.com/typescript-2-1-introduction-async-await)

Cada función async devuelve una `Promise`. Esto significa que puedes retornar valores diferidos y Nest los resolverá por si mismo. Veamos esto en un ejemplo:

```js
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

Es más, los handlers de Nest son aún más poderosos. Pueden devolver el flujo de `observables` de RxJS. Así que la migración entre la aplicación web y los microservicios de Nest sea mucho más simple.
```js
@Get()
findAll(): Observable<any[]> {
  return Observable.of([]);
}
```

## POST handler ##

Es raroq ue hasta ahora los handlers de POST que vimos no aceptan ningun parámetro del cliente. Definitivamente deberíamos de esperar un `@Body()` aquí.

Primero, debemos de establecer el esquema de `DTO` (Data Transfer Object). Podríamos hacer esto usando las interfaces de `TypeScript`, o simplemente clases. Puede sonar sorpresivo pero recomendaremos usar `clases`. ¿Por qué? Las clases son parte del standard ES6 de Javascript, por lo que son simplemente funciones planas. Por otro lado, las interfaces de TypeScript son eliminadas al momento de la transpilación, Nest no puede referirlas. Es importante porque funcionalidades como `Pipes` habilitan posibilidades adicionales cuando se puede acceder al `metatype` de la variable. 

Creemos `CreateCatDto`:
```  js
export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
```
Sólamente tiene 3 propiedades básicas. Todas estas marcadas como `readonly`, porque deberíamos siempre que se puede hacer nuestras funciones lo más puras posibles. 

Ahora podemos usar este esquema dentro del `CatsController`:

```js
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  // TODO: Add some logic here
}
```

`Express` no parsea el body por defecto. Necesitamos el middleware para esto, que se llama [body-parser](https://github.com/expressjs/body-parser). El uso es muy sencillo, porque la instancia de Nest ya provee del método `use()`. El cual es un wrapper de la función nativa de Express con el mismo nombre.

```  js
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(bodyParser.json());
  await app.listen(3000);
}
bootstrap();
```

## Último paso

El controller está listos para ser usado, pero Nest no sabe que `CatsController` existe, por lo que no creará una instancia de la clase hasta que no la importemos.

El controller siempre pertenece a un módulo, y se ingresa en el array de controllers dentro del decorator `@Module()`. Dado que hasta el momento no tenemos ningún otro módulo excepto el principal (`AppModule`), usemos este por ahora:

```  js
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
    controllers: [CatsController],
})
export class ApplicationModule {}
```

Tada! Acabamos de adjuntar la metadata a la clase del módulo, ahora Nest puede facilmente reflejar qué controllers tiene para poder ser inicializados.

## El enfoque Express

La segunda forma de manipular las respuesta es usando el `response object` de Express. Fue la única opción disponible hasta Nest 4. Para inyectar el `response object`, necesitamos usar el decorator `@Res()` como ya mencionamos. Para mostrar la diferencia , vamos a reescribir el `CatsController`:

```ts
import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res, @Body() createCatDto: CreateCatDto) {
    // TODO: Add some logic here
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res) {
     res.status(HttpStatus.OK).json([]);
  }
}
```

Desde nuestro punto de vista, esta forma es mucho menos clara. El primer enfoque es preferido por sobre este, pero para lograr una compatiblidad hacia atrás con versiones previas, este segundo enfoque sigue disponible. Además, el `response object` da mayor flexibilidad - así tendrás mayor control de la respuesta.