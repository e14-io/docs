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

## Routing

### Ruta básica
```js
  var express = require('express');
  var app = express();

  app.get('/', function(req, res) {
    res.send('hello world');
  });

```

### Método de ruta
Para manejo de métodos ```GET```, ```POST```
```js
  // GET method route
  app.get('/', function (req, res) {
    res.send('GET request to the homepage');
  });

  // POST method route
  app.post('/', function (req, res) {
    res.send('POST request to the homepage');
  });
```

### Accesos a rutas
Express usa strings o expresiones regulares para matchear los pedidos

Basados en strings
```js
  // matchea con '/'
  app.get('/', function (req, res) {
    res.send('root');
  });

  // matchea con '/about'
  app.get('/about', function (req, res) {
    res.send('/about');
  });

  // matchea con /abRANDOMTEXTcd
  app.get('/ab*cd', function(req, res) {
    res.send('ab*cd');
  });
```

Basados en expresiones regulares
```js
  // matchea con cualquier valor que tenga una 'a' en el mismo
  app.get(/a/, function (req, res) {
    res.send('/a/');
  });

  // matchea con 'butterfly' y 'dragonfly' pero no con 'butterflyman', 'dragonfly man'
  app.get(/.*fly$/, function (req, res) {
    res.send('/.*fly$/');
  });
```

### Parámetros
```
  Ejemplo Path: /users/:userId
  /users/34
  req.params: { "userId": "34" }
```
```
  Ejemplo Path: /flights/:from-:to
  /flights/MVD-NYC
  req.params: { "from": "MVD", "to": "NYC" }
```

### Métodos de respuesta

| Método | Descripción |
|-|-|
| res.download() | Para descaargar archivos |
| res.end() | Finaliza el proceso |
| res.json() | Respuesta como JSON |
| res.jsonp() | Respuesta como JSON con soporte JSONP |
| res.redirect() | Redirecciona una request |
| res.render() | Renderiza una vista |
| res.send() | Envía una respuesta de varios tipos |
| res.sendFile() | Envía un archivo |
| res.sendStatus() | Envía status code |

### Express Router

Esta clase sirve para crear route handlers de forma modular.

Ejemplo un archivo users.js

```js
var express = require('express')
var router = express.Router()

// root de usuario
router.get('/', function (req, res) {
  res.send('Usuarios raiz')
})
// perfil
router.get('/perfil', function (req, res) {
  res.send('perfil usuarios')
})

module.exports = router
```

app.js
```js
var users = require('./users.js')

app.use('/users', users)
```

La aplicación va a responder ante un pedido en: 
``` /users``` y ```/users/perfil``` sin necesidad de escribir todas las rutas en ```app.js```

## Error handling

Forma básica, como middleware:
```js
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

Ejemplo un poco más complejo, donde ante un error se puede querer guardar o procesar la info del error:
```js
  var bodyParser = require('body-parser')
  var methodOverride = require('method-override')

  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  function logErrors (err, req, res, next) {
    // se puede usar una herramienta para loggear errores.

    //luego se pasa el error al siguiente middleware
    next(err)
  }

  // si son errores del lado del cliente, si no pasa el error al siguiente middleware
  function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
  }

  // por último definimos un errorHandler para mostrar el error.
  function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
  }


```

## Buenas prácticas de seguridad

- Usar última versión de express (4.X actualmente)
- Usar TLS
- Usar Helmet (es una librereia con un conjunto de middlewares con funciones de seguridad)
```sh
  $ npm install --save helmet
```
```js
  var helmet = require('helmet')
  app.use(helmet())
```

## Buenas practicas de performance

Cosas a realizar en el código

- Utilizar la compresión de gzip
- No utilizar funciones síncronas
- Utilizar el middleware para el servicio de archivos estáticos
- Realizar un registro correcto
- Manejar las excepciones correctamente


Cosas para hacer en la configuración

- Establecer NODE_ENV en “production”
- Asegurarse de que la aplicación se reinicia automáticamente
- Ejecutar la aplicación en un clúster
- Almacenar en la caché los resultados de la solicitud
- Utilizar un load balancer
- Utilizar reverse proxy

Más info en: [sitio de express](http://expressjs.com/en/advanced/best-practice-performance.html)