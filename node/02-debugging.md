# Debugging
Se puede debuggear vía inspector o con chrome dev tools

## Usando Inspector. (node v8+) vía command line.

```sh
  $ node inspector app.js
  # comienza en la línea 1 si no hay breakpoints

  $ n # next line
  $ c # continua hasta el próximo breakpoint

```

- Agregando la sentencia ```debugger``` en el código, se agrega un _breakpoint_.

- Usando la cláusula ```repl``` para el debugger y se puede inspeccionar elementos
Ejemplo

```js
  // En app.js
  var person = {
    name: 'Andrew'
  };

  person.age = 25;

  debugger; // Agrega un breakpoint

  person.name = 'Mike';
```
```sh
  # en la consola
  $ node inspect app.js # va hacia la linea donde está debugger
  debug> repl
  debug> person # { name: 'Andrew', age: 25 }
```

## Usando Chrome Dev Tools

```sh
  $ node --inspector-brk app.js
```

En Chrome tipeamos chrome://inspector y accedemos al link con la aplicación corriendo.

Usando ```nodemon``` se puede correr una nueva instancia de debugging cada vez que se guarda un archivo

```sh
  $ nodemon --inspect-brk app.js
```