# Apuntes basados del curso The Complete Node.js Developer Course (2nd Edition)
[The Complete Node.js Developer Course (2nd Edition)](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview)

__Node es un engine basado en javascript el cual da la posibilidad de extender el uso por fuera del navegador__

De esta manera se permite manipular archivos, consultar bases de datos, etc.

## Sección 1: Welcome
## Sección 2: Instalación de Node js

Se asumen las dos primeras secciones, ver [doc de Node](https://nodejs.org/es/)

## Sección 3: Fundamentos de Node.js

### Uso de require

  - Sirve para invocar librerías nativas de node
  - librerías de terceros
  - archivos/librerías externos propios

  ```js
      // Ejemplo de uso de librerías de sistema (os)
      const os = require('os');
      let user = os.userInfo();
      console.log(`Hola ${user.username}`);
      // > Hola braulio
  ```

  ```js
      // Ejemplo de uso de archivos externos propios

      // external.js
      console.log('external.js content');

      // app.js
      console.log('app.js content');
      const external = require('./external.js');

      // Ejemplo de salida en consola
      // > app.js content
      // > external.js content

  ```

#### Uso de exports
Sirve para exportar propiedades dentro de un modulo, para ser consumidas por otro.

```js
  // external.js
  module.exports.age = 20;

  // app.js
  const external = require('./external.js');

  console.log(`Tu edad es ${external.age}`);
  // Tu edad es 20

```

También puede aplicar a funciones

```js
  // external.js
  module.exports.addExternal = () => {
    return 'soy external.js';
  };

  // app.js
  const external = require('./external.js');

  console.log(`respuesta: ${external.addExternal()}`);
  // respuesta: soy external.js

```

---
Mini desafio:

Escribir una funcion en external.js que reciba 2 enteros y devuelva el producto entre ellos (asumimos que no hay que controlar tipos de entradas)

Solución

```js
  // external.js
  module.exports.product = (a, b) => {
    return a * b;
  };

  // app.js
  const external = require('./external.js');

  console.log(`respuesta: ${external.product(2, 3)}`);
  // respuesta: 6

```

---

#### Instalación de paquetes de terceros

```sh
  # Se crea el archivo package.json
  $ npm init

  # Se siguen los pasos para generar el package.json

  # Para instalar paquetes de terceros:
  $ npm install <pkgName> --save

  # Ejemplo lodash
  $ npm install lodash --save

```

Ejemplo de uso

```js
  // require de librerias del core
  const fs = require('fs');
  // require de 3rd party
  const _ = require('lodash');
  // require de librerias del core
  const external = require('./external');

  // ejemplo usando lodash
  console.log(_.isString('Juan'));
  // true
  console.log(_.uniq([3, 1, 2, 3, 5, 4, 5]))
  // [3, 1, 2, 5, 4]

```
Mas info en la página de [lodash](https://lodash.com/docs)

### Instalación de nodemon
Nodemon es un watcher que reinicia la aplicación node cuando un archivo es guardado

```sh
  # Es necesario instalar nodemon global
  $ npm install nodemon -g

  # Las aplicaciones se ejecutaran de la siguiente manera:
  $ nodemon app.js
```

### Argumentos a traves de la consola

Los procesa via ```process.argv```

Ejemplo:
```sh
  $ node app.js

  # en app.js
  console.log(process.argv);

  # [ '/Users/brauliodeleon/.nvm/versions/node/v6.9.0/bin/node',
  #   '/Users/brauliodeleon/repos/node-course/app.js' ]

  # Si paso argumentos:
  $ node app.js hola

  # [ '/Users/brauliodeleon/.nvm/versions/node/v6.9.0/bin/node',
  #   '/Users/brauliodeleon/repos/node-course/app.js',
  #   'hola' ]

  # La forma de trabajo será la siguiente:

  $ node app.js comando
```
```js
  // app.js
  var command = process.argv[2]
  if (command === 'comando') {
    console.log('El argumento es comando');
  } else {
    console.log('argumento no reconocido');
  }


```
El recibir argumentos por línea de comandos puede escalar fácilmente
por ejemplo:
```sh
  $ node app.js ingresarObjeto --name="titulo" --body="contenido"
```
Para esto hay una librería que resuelve esta funcionalidad [Yargs](https://github.com/yargs/yargs)
