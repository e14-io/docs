# Manejo de archivos

## Importación

El manejo se realiza mediante la librería ```fs```
```js
const fs = require('fs');
```

## Leer Archivos
```js
  // lectura asincróna de archivo
  fs.readFile('path/to/file', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });

  // lectura sincrónica de archivo
  var data = readFileSync('path/to/file', 'utf-8');
  console.log(data);
```
La lectura síncrona de archivos, no es recomendada en un servidor, ya que el I/O 
de node al ser bloqueante, no atendería peticiones si está procesando el archivo de manera síncrona

## Escribir Archivos
```js
  // escritura asincróna de archivo
  fs.writeFile('path/to/file', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('archivo creado');
  });

  // escritura sincrónica de archivo
  var data = writeFileSync('path/to/file', 'utf-8');
  console.log(`Fueron escritos ${data} bytes`);
```

## Leer, procesar y Escribir archivos grandes

Cuando se lee un archivo, el contenido del mismo se guarda en memoria.
Al manejar grandes cantidades esto es una limitante.

Para esto está el manejo de streams de datos.
Se pueden usar lecturas por chunks (porciones de datos (64kb)), etc.

Ejemplo para leer un archivo en csv y procesarlo como xml
```js
  fs.readFile('cities.csv', 'utf-8', (err, data) => {
    if (err) throw err;

    let rows = data.split('\n');
    let cells = arr[0].split(',');
    processLine(keys);
  });

  var processLine = (keys) => {

    let rs = fs.createReadStream('.cities.csv');
    let ws = fs.createWriteStream('.cities.xml');

    var lineReader = readLine.createInterface({
      input: rs,
      output: ws
    });


    ws.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
    ws.write(`<cities>\n`);

    lineReader
      .on('line', (line) => {
        // se ejecuta en cada nueva linea

        let xmlObject = '\t<city>\n';
        let cityContent = line.split(',');
        let zip = _.zipWith(cityContent, keys, (a, b) => `\t\t<${b}>${a}</${b}>\n`).join('');
        xmlObject = xmlObject.concat(zip);
        xmlObject += '\t</city>\n';
        ws.write(xmlObject);
      })
      .on('close', () => {
        // se procesaron todas las lineas

        console.log('Se procesó todo el .csv');
        ws.write(`</cities>\n`);
      })
  }

```

