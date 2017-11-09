# Testing
## Testing usando Mocha

Ejemplo:
```js
// utils.js
module.exports.add = (a, b) => a + b;
```

```js
// utils.test.js
const utils = require('./utils');
it('deberia sumar 2 numeros', () => {
  var res = utils.add(33, 11);
  if (res !== 44) {
    throw new Error(`Expected 44 pero el resultado fue ${res}`);
  }
});


```
```sh
  ✓ deberia sumar 2 numeros

  1 passing (6ms)

```

Una forma para correr un watcher para tests

```sh
  $ nodemon --exec 'npm test'
```

Generalizando, en el package.json:

```json

  "scripts": {
    "test": "mocha **/*.test.js",
    "test-watcher": "nodemon --exec 'npm test'"
  },

```

## Usando jest

```sh
  $ npm i jest --save
```

```json
  "scripts": {
    "test": "jest",
    "test-watcher": "nodemon --exec 'npm test'"
  },
```

```js
  const utils = require('./utils');


  describe('tests', () => {
    test('test 1', () => {
      var res = utils.add(3, 9);
      expect(res).toBe(12);
    });

    test('test 2', () => {
      var res = utils.add(3, 4);
      expect(res).toBeLessThan(13);
    });

    test('test 3', () => {
      var obj = {
        value1: 3,
        value2: 5
      };
      expect(obj.value1).toBe(3);
    });
  });
```
## Test en funciones asíncronas.

De forma muy similar a como se testea código sincrónico, en este caso pasamos una función de callback que indica a mocha que se esta ejecutando una función asincrónica y que debe esperar a que esta termine para verificar los resultados.

```js
  it('should async add two numbers', (done) => {
    utils.addAsync(4, 3, (sum) => {
      expect(sum).toBe(7).toBeA('number');
      done();
    })
  })
```

## Test de aplicaciones express.

Para comenzar creamos una simple aplicación express:

```js
  const express = require('express');

  var app = express();

  app.get('/', (req, res)  => {
    res.send('Hello world!');
  });

  app.listen(3000);
```

 Para facilitar el proceso de testear estas aplicaciones instalamos la siguiente librería:

 ```sh
    npm i supertest --save-dev
 ```

desarrollada por los creadores de express.

Escribimos el test de la siguiente forma:

```js
  const request = require('supertest');
  const app = require('./server').app;

  it('should return hello world response', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!')
      .end(done);
  })
```

## Spies

Las Spies son útiles para testear la invocación a funciones dentro de otras, sin realmente hacerlo. Para esto definimos una spy que reemplaza la función cuya invocación queremos probar por otra función con fines únicamente de prueba.

En el siguiente código creamos una spy, la invocamos y utilizando expect verificamos que haya sido incovada.

```js
const expect = require('expect');

describe('App', () => {

  it('Should call the spy correctly', () => {
    const spy = expect.createSpy();
    spy();
    expect(spy).toHaveBeenCalled();
  })

})
```

También podemos llamar a la spy con parámetros y verificar que haya sido invocada con estos. Simplemente intercambiando estas líneas:

```js
spy('Schubert', 24);
expect(spy).toHaveBeenCalledWith('Schubert', 24);
```

Asumiendo que tenemos el siguiente código:

```js
const db = require('./db');

module.exports.handleSingUp = (email, password) => {
  // Check if the email already exists
  db.saveUser({ email, password });
  // Send a welcome email
}
```
Sobre el cual queremos probar que cada vez que handleSingUp es invocada, se invoca también db.saveUser con los párametros correctos. Lo primero que debemos hacer es reemplazar la función db.saveUser por una spy. Para esto utilizamos un módulo de npm llamado "rewire".

```sh
  $ npm i rewire@2.5.2 --save-dev
```

Rewire requiere utilizarse como si fuese "require", de esta forma importamos el módulo que queremos modificar.

```js
  const app = rewire('./app')
```
Lo que hace rewire en esta línea es un "require" del módulo app y a la vez agrega dos métodos útiles para reemplazar propiedades.

```js
  app.__set__
  app.__get__
```
De esta forma usando el primero de los metodos reemplazamos la función, incovamos a quien la contiene y verificamos que haya ocurrido utilizando expect.

```js
const expect = require('expect');
const rewire = require('rewire');

const app = rewire('./app');

describe('App', () => {

  // We create the spy that wraps up the function that we want to replace 'saveUser'
  var db = {
    saveUser: expect.createSpy()
  }

  // We replace the function on our module using rewire methods
  app.__set__('db', db);

  it('should call the spy correctly', () => {
    const spy = expect.createSpy();
    spy('Schubert', 24);
    expect(spy).toHaveBeenCalledWith('Schubert', 24);
  })

  it('should call saveUser with user object', () => {
    const email = 'schubert@bros.me';
    const password = 'password';

    app.handleSignUp(email, password);
    expect(db.saveUser).toHaveBeenCalledWith();
  })

})
```
