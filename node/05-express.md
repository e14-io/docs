# Express Framework

Es una librería para crear webapps, maneja el modelo MVC sobre node.
Maneja routing, middlewares, authentication, etc.

Ejemplo mínimo una aplicación express.

```js

  const express = require('express');
  var app = express();

  app.get('/', (req, res) => {
    res.send('Hello world');
    // la respuesta será del tipo 'text/html'
  });

  app.get('/json-way', (req, res) => {
    res.send({
      nombre: 'Juan',
      edad: 23
    });
    // la respuesta será del tipo 'application/json'
  });

  app.listen(3000);

```

Ejemplo manejando vistas con handlebars
```sh
  $ npm install hbs --save
```
Las vistas en express se manejan por default en una carpeta views
```js
  const express = require('express');
  const hbs = require('hbs');

  var app = express();

  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + '/public'));

  app.get('/', (req, res) => {
    res.render('main.hbs', {
      title: 'Home Page',
      h1: 'Home',
      paragraph: 'Bienvenido a la web'
    });
  });

  app.listen(3000);

```
```html
<!-- main.hbs -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
  <head>
  <body>
    <h1>{{ h1 }}</h1>
    <p>{{ paragraph }}</p>
  </body>
</html>
```

## Middlewares
Son funciones que ante una request (que coincide con la ruta solicitada) se ejecutan previamente.
Por ejemplo: en un sitio hay una ```request``` para acceder al perfil de un usuario, express debería verificar si la request tiene los permisos necesarios para mostrar esa información.
Esa función de middleware, chequea si se cumplen las condiciones, y si se cumple, se invoca la función para mostrar los datos del perfil

```js
  const express = require('express');
  const hbs = require('hbs');
  const fs = require('fs');

  var app = express();

  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + '/public'));

  // uso de middlewares
  app.use((req, res, next) => {
    // este caso es trivial, al llamar a next() se invoca la siguiente funcion
    next();
  });

  // ejemplo para loggear requests
  app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now} ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n');
    next();
  });

  app.get('/', (req, res) => {
    res.render('main.hbs', {
      title: 'Home Page',
      h1: 'Home',
      paragraph: 'Bienvenido a la web'
    });
  });

  app.listen(3000);

```