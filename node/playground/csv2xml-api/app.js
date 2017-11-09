const fs = require('fs');

const _ = require('lodash');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const readLine = require('readline');

var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});


app.post('/api/upload', upload.single('file'), (req, res) => {
  res.send('subido');
});

app.get('/api/keys', (req, res) => {
  fs.readFile('uploads/cities.csv', 'utf-8', (err, data) => {
    if (err) throw err;
    var keys = data.substr(0, data.indexOf('\n')).split(','); // extract the first line and makes a split
    if (keys) {
      res.send({ keys });
    } else {
      res.send('Hubo un error al leer el archivo');
    }
  });
});

app.get('/api/download', (req, res) => {
  fs.readFile('uploads/cities.csv', 'utf-8', (err, data) => {
    if (err) throw err;
    let arr = data.split('\n');
    console.log(`Total de records: ${arr.length}`);
    let keys = arr[0].split(',');
    let someCities = _.take(arr, arr.length - 1);

    fs.writeFile('./uploads/cities-min.csv', someCities.join('\n'), 'utf8', (err) => {
      if (err) throw err;
      console.log('file min saved');
      processLine(null, keys);
    });

  });

  var processLine = (callback, keys) => {
    console.log('Se está procesando el archivo csv y se está escribiendo el xml')
    let rs = fs.createReadStream('./uploads/cities-min.csv');
    let ws = fs.createWriteStream('./uploads/cities.xml');

    var lineReader = readLine.createInterface({
      input: rs,
      output: ws
    });


    ws.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
    ws.write(`<cities>\n`);

    // se toma cada linea del csv y se crea el objeto 'city' en el xml
    lineReader.on('line', (line) => {
      let xmlObject = '\t<city>\n';
      let cityContent = line.split(',');
      let zip = _.zipWith(cityContent, keys, (a, b) => `\t\t<${b}>${a}</${b}>\n`).join('');
      xmlObject = xmlObject.concat(zip);
      xmlObject += '\t</city>\n';
      ws.write(xmlObject);
    });

    lineReader.on('close', () => {
      console.log('Se procesó todo el .csv');
      ws.write(`</cities>\n`, () => {
        console.log('descargando archivo...');
        res.download('./uploads/cities.xml', (err) => {
          if (err) throw err;
        });
      });
    })
  }
});



app.listen(3000);