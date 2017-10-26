# Fundamentos de HATEOAS

__HATEOAS es una restricción de la arquitectura REST
donde básicamente el cliente REST puede ir navegando a través de la información y no necesita ningún conocimiento previo de la arquitectura__

Cuando un servidor nos devuelve un recurso, también nos devuelve recusos asociados en forma de hipervínculos.

Por ejemplo tenemos la siguiente solicitud para un usuario:
```
 dominio/usuario/:id
 ```

Extendiendo el ejemplo podría ser que el usuario tuviera una histórico de compras.

Dependiendo de la arquitectura tendríamos dos posibles variantes, traer el usuario solo o el usuario y todo su histórico de compras.

La primera. No sólo tiene información sobre los pedidos, puede ocurrir el caso donde cambie la URI de pedidos y todos los clientes deban cambiar la dirección de la petición.

La segunda puede tener más información de la que necesitamos.

Entonces, lo que propone HATEOAS es ante una consulta a clientes (ej: id=2), devolver lo siguiente:

```
{
  id: 2,
  name: 'Juan',
  lastName: 'Perez,
  links: [
    compras: {
      href: '2/compras',
      type: 'GET'
    }
  ]
}
```

De esta manera la API tiene más libertad para cambiar sus endpoints sin afectar a los clientes que la consuman.

[Link de Wikipedia](https://en.wikipedia.org/wiki/HATEOAS)

