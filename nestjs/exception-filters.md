# Exception Filters

En Nest hay una capa para manejar `exceptions`, la cual se responsabiliza de atrapar (catch) excepciones no manejadas y retornar una respuesta apropiada al usuario final.

![middlewares](imgs/Filter_1.png)

Cada excepción no manejada es tomada y cuando se trata de una **request HTTP**, el usuario recibe un JSON como respuesta similar al de abajo:

```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```
Por supuesto, el objetivo es evitar pasar excepciones no manejadas a través de la aplicación.

## HttpException

Existe una clase nativa de Nest llamada `HttpException`.
Cuando se arroja un objeto `HttpException`, será transformado en una respuesta JSON.

En `CatsController`, tenemos un método `create()` (ruta `POST`). Asumamos que este `route handler` tira una excepción por algún motivo. 

```ts
// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

**ADVERTENCIA** He usado `HttpStatus` aquí. Es simplemente un helper enumerado importado del paquete `@nestjs/common`.

La respuesta al cliente será:

```json
{
    "statusCode": 403,
    "message": "Forbidden"
}
```

## Exceptions Hierarchy

Una buena práctica es crear tu propia **jerarquía de excepciones**. Esto significa que cada excepción HTTP debería de `heredar` desde una clase `HTTPException` base.

```ts
// forbidden.exception.ts
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

Dado que `ForbiddenException` extiende de `HttpException`. l

