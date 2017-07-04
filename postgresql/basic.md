## select con count, limit y offset

```

select *, count(id) over() as full_count 
  from tableName
  where conditions
  limit 10
  offset 0
  
```
