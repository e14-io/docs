# Controllers #

La capa de controllers es responsable de manejar las peticiones entrantes (mayoritariamente HTTP).

![controllers](imgs/Controllers_1.png)

Para decirle a Nest que `CatsController` es un controller, se debe agregar `metadata` a la clase. Esto se hace usando `decorators`.

```
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

```
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