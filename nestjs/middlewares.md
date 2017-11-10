# Middlewares

Un `middleware` es una función que se llama **antes** que el `route handler`. Las funciones middleware tienen acceso a los objetos `request` y `response` y pueden modificarlos. También pueden funcionar como **barrera** - en caso que el middleware no llame a `next()`, la `request` jamás será atendida por el `route handler`.

![middlewares](imgs/Middlewares_1.png)

El decorator `@Middleware()` se le agrega a la clase y es importante que la clase implemente la interfaz `NestMiddleware`:

```ts
import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
  // The resolve() method has to return the regular expressjs middleware (req, res, next) => void
  resolve(...args: any[]): ExpressMiddleware {
    return (req, res, next) => {
      console.log('Request...');
      next();
    };
  }
}
```

## Dependency Injection

Al igual que los `components` y `controllers`, los middlewares pueden inyectar dependencias pertenecientes al mismo módulo.

## Where to put the middlewares?

Los middlewares no deben ser listados en el decorator `@Module()`. Se configuran implementando el método `configure()` dentro de la clase del módulo. Para esto, si el módulo utiliza un `middleware` hay que implementar en su clase la interfaz `NestModule`.   
Configuremos `LoggerMiddleware` a nivel de `ApplicationModule`.

```ts
// app.module.ts
import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
    modules: [CatsModule],
})
export class ApplicationModule implements NestModule {
    // MiddlewareConsumer is a helper class, 
    // it provides several methods to work with middlewares and can be chained
    configure(consumer: MiddlewaresConsumer): void {
        // fourRoutes() can take single object, multiple objects and one or more controller classes
        // The apply() method can take single middleware or an array of middlewares.
        consumer.apply(LoggerMiddleware).forRoutes(
            { path: '/cats', method: RequestMethod.GET },
            { path: '/cats', method: RequestMethod.POST },
        );
    }
}
``` 

**PISTA:** Se podría pasar un único objeto dentro de `forRoutes()` y usar `RequestMethod.ALL`.

En el ejemplo de arriba configuramos `LoggerMiddleware` para los route handlers de  `/cats`, los cuales hemos registrado dentro de `CatsController`. 
En la mayoría de los casos probablemente sólo pasemos  `controllers` separados por coma en `forRoutes()`.  
Debajo se muestra un ejemplo con un único `controller`:

```ts
// app.module.ts
import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
    modules: [CatsModule],
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes(CatsController);
    }
}
```
**PISTA:** El método `apply()` puede tomar un middleware o un `array de middlewares`.

## Pass arguments to the middleware

A veces el comportamiento de un middleware depende de valores personalizados, por ejemplo; un array de roles, opciones de objetos, etc. Podemos pasar argumentos adicionales a `resolve()` usando el método `with()`.

```ts
// app.module.ts
import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
    modules: [CatsModule],
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(LoggerMiddleware)
            .with('ApplicationModule') // <= pasamos un string a resolve()
            .forRoutes(CatsController);
    }
}

```

Ahora veamos como ajustar `resolve()` para usar el string "ApplicationModule" dentro de `LoggerMiddleware`:

```ts
// logger.middleware.ts
import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
  // The value of the name property will be ApplicationModule.
  resolve(name: string): ExpressMiddleware {
    return (req, res, next) => {
      console.log(`[${name}] Request...`); // [ApplicationModule] Request...
      next();
    };
 }
}
```

## Async Middlewares

No hay contradicción en retornar `async` desde `resolve()`. Es posible hacer `resolve` un método `async` también. Este patrón es llamado **deffered middleware** (middleware diferido).

```ts
// logger.middleware.ts
import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
  async resolve(name: string): Promise<ExpressMiddleware> {
    await someAsyncFn();

    return async (req, res, next) => {
      await someAsyncFn(); // <= async function
      console.log(`[${name}] Request...`); // [ApplicationModule] Request...
      next();
    };
 }
}
```

## Functional Middlewares
En el ejemplo `LoggerMiddleware` es bastante corto, sin dependencias ni métodos adicionales. ¿Por qué no usar una simple función? - de hecho, se puede. A este tipo de middlewares se les denomina `functional middleware`.
Transformemos el logger en una función.

```ts
// logger.middleware.ts
export const loggerMiddleware = (req, res, next) => {
  console.log(`Request...`);
  next();
};

// app.module.ts
import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { loggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
  modules: [CatsModule],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer.apply(loggerMiddleware).forRoutes(CatsController);
  }
}
```
**PISTA:** Considerar usar `functional middlewares` cada vez que el middleware no tenga dependencias.