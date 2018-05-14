const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
require('dotenv').config();

const mongoDbUrl = `mongodb://${process.env.MONGO_USER}:${
  process.env.MONGO_PASS
}@ds041556.mlab.com:41556/feud-api`;

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
    if (error) return res.status(500, { error }).send(error);

    console.log('saved to database');
    res.sendStatus(200);
  });
});

app.get('/questions', (req, res) => {
  db
    .collection('questions')
    .find()
    .toArray(function(error, results) {
      if (error) return res.status(500, { error }).send(error);
      res.status(results);
    });
});

app.post('/answer', (req, res) => {
  db.collection('answers').save(req.body, (error, result) => {
    if (error) return res.status(500, { error }).send(error);

    console.log('saved to database');
    res.sendStatus(200);
  });
});

app.get('/answers', (req, res) => {
  db
    .collection('answers')
    .find({ question_id: req.query.question })
    .toArray(function(error, results) {
      if (error) return res.status(500, { error }).send(error);
      res.status(results);
    });
});
