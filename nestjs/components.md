# Components

Casi todo es un componente - Service, Repository, Factory [...] y pueden ser inyectados en `controllers` o en otros componentes a través de los constructores.

![components](imgs/Components_1.png)

En el capítulo anterior construímos un simple `CatsController`.

El controller debería solamente manejar peticiones HTTP y delegar tareas más complejas a los componentes. Los `componentes` son clases de TypeScript con el decorador `@Component()`.

**PISTA:**
Ya que Nest ofrece la posibilidad de diseñar y organizar las dependencias de una forma más Orientada a Objetos, recomendamos fuertemente seguir los [SOLID principles](https://es.wikipedia.org/wiki/SOLID).

Creemos ahora un componente `CatsService`:

```ts
import { Component } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Component()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

No hay nada específico más que el decorator `@Component()` que diferencie esta clase de otras. El decorator `@Component()` le dice a Nest que esta clase es un componente de Nest.

**ADVERTENCIA:**
Hay una interfaz `Cat` en el ceodigo de arriba. No se hace mención porque es exactamente el mismo esquema que se usa en `CreateCatDto`.

Ya armada la clase de este servicio, vamos a usarla dentro de nuestro `CatsController`:

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

El servicio `CatsService` se inyecta dentro del constructor de la clase. No se asusten con `private readonly`. Simplemente nos estamos asegurando de crear e inicializar el `catsService` al mismo momento.

## Dependency Injection

Nest está construído alrededor de un fuertes patrones de diseño comunmente conocido como `Dependency Injection`. Existe un gran artículo sobre este concepto en la [documentación oficial de Angular](https://angular.io/guide/dependency-injection).

**PISTA**
Puedes aprender más sobre `Dependency Injection` [aquí](https://docs.nestjs.com/advanced/dependency-injection).

Es sumamente sencillo manejar dependencias con `TypeScript`, porque Nest reconocerá tus dependencias por `type`. La siguiente linea es todo lo que debes hacer:

```ts
constructor(private readonly catsService: CatsService) {}
```

Hay una sóla cosa más importante a hacer -- debes de dejar como `true` la opción `emitDecoratorMetadata` en tu archivo `tsconfig.json`. Eso es todo.

## Último paso

El último paso es decilre al modulo principal que `CatsService` existe. Para eso abrimos `app.module.ts`, e incluímos el servicio dentro del array `components` en el decorator `@Module()`.

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
    controllers: [CatsController],
    components: [CatsService], // <= Incluímos el servicio aquí
})
export class ApplicationModule {}
```

Nest resolverá por si solo las dependencias que tiene `CatsController`.