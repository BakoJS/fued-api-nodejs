const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
require('dotenv').config();

const mongoDbUrl = `mongodb://admin:${
  process.env.MONGO_PASS
}@ds239359.mlab.com:39359/devfeud`;

let db;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(mongoDbUrl, (err, client) => {
  if (err) return console.log(err);
  db = client.db('devfeud');

  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/question', (req, res) => {
  db.collection('questions').save(req.body, (error, result) => {
    if (error) return res.send(500, { error });

    console.log('saved to database');
    res.sendStatus(200);
  });
});
