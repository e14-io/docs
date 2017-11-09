# Arrow functions
Es una nueva funcionalidad de ES6 que busca mejorar la legibilidad del código

Ejemplo básico
```js
  // ES5
  function cuadrado(x) {
    return x * x;
  }
  console.log(cuadrado(9)); // 81


  // ES6: Arrow Functions
  var cuadrado = x => x * x;
  console.log(cuadrado(9)); // 81
```

Arrow functions no tienen el concepto de ```this```. Acá va un ejemplo

```js
  var user = {
    name: 'John',
    sayHi: () => {
      console.log(`Hi, I'm ${this.name}`);
    },
    sayHiAlt() {
      console.log(`Hi, I'm ${this.name}`);
    }
  }

  user.sayHi(); // Hi, I'm undefined
  user.sayHiAlt(); // Hi, I'm John

```