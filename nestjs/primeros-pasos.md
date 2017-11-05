# Primeros Pasos

En este conjunto de artículos aprenderás los fundamentos básicos de Nest. La idea principal es que te familiarices con la construcción de los bloques principales de Nest. Vas a construir una aplicación CRUD básica, la cuál en sus características cubrirá bastante terreno a nivel de la industria.  

## Lenguaje ##

Estamos enamorados de `TypeScript`, pero por sobre todo - amamos `Node.js`. Esa es la razón por la cual Nest es compatible con ambos, Typescript y `JavaScript` puro. Nest se aprovecha de los últimos avances del lenguaje, por eso para usar el framework con simple Javascript necesitamos el compilador `Babel`.  

En esta documentación, estamos usando mayoritariamente Typescript, pero siempre puedes alternar entre los `code snippets` para usar la version `JavaScript` cuando el fragmento de código contiene algunas expresiones específicas de `TypeScript`.

## Setup ##

Poner en marcha un proyecto es bastante simple con el repositorio `Starter`. Sólo debes asegurarte de tener npm instalado y de usas el siguiente comando en tu terminal:

```
// TypeScript

$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start

// JavaScript

$ git clone https://github.com/nestjs/javascript-starter.git project
$ cd project
$ npm install
$ npm run start
```

El directorio `project` contendrá muchos archivos del core dentro del sub directorio `src`. Siguiendo la convención, los módulos nuevos deberán de ser almacenados dentro del sub directorio `modules`.

`server.ts`  
Es el archivo de entrada de la aplicación. Utiliza `NestFactory` una instancia de la aplicación `Nest`.   
  
`modules/app.module.ts`  
Define `AppModule`, el módulo raíz de la aplicación. Ha este punto no tiene ninguna metadata porque no hemos creado ningún componente o controlador aún.

En `server.ts` hay solamente una función async llamada `bootstrap` responsable de cargar nuestra aplicación.

```
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(3000);
}
bootstrap();
```

Siempre deberíamos de crear nuestra instancia de aplicación Nest usando la `NestFactory`. El método `create()` retorna un objeto que satisface a la interfaz `INestApplication`, y provee un conjunto utilizable de métodos, los cuales se definen en detalle en las siguientes secciones.