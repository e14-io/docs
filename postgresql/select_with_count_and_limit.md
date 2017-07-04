## select con count, limit y offset

Este select devuelve las rows de _tableName_ que cumple con _conditions_ y limitado por _limit_, de todas formas en full_count se devuelve el total de rows que cumplen las condiciones.

Esto es util cuando se quiere contar el total de rows que cumplen una condicion, poder usar limit, sin perder informacion y en una sola query.

```

select *, count(id) over() as full_count 
  from tableName
  where conditions
  limit 10
  offset 0
  
```
source: 
https://www.postgresql.org/docs/current/static/tutorial-window.html
