# Fued Api - Using Node.js and Mongodb
Below are the steps we will follow at the meetup to create our api

# Getting Started with Node.js & Mongodb Tutorial

## Create Project
```bash
  mkdir dev-fued-express-api
  cd dev-fued-express-api
  yarn init
```

## Installing Express
Add dependency and create Server file.
```bash
  yarn add express
  touch server.js
```

Inside of `server.js` require express and listen for requests on port 3000
```javascript
  const express = require('express');
  const app = express();

  app.listen(3000, function() {
    console.log('listening on 3000')
  })
```

Setup First Route
```javascript
  // app.get(path, callback)
  app.get('/', (req, res) => {
    res.send('Hello World!');
  })
```

## Posting Form Data
Out of the box, Express does not handle form data, in order for us to handle it we will need to install the `body-parser` middleware.

```
  yarn add body-parser
```

```javascript
  const express = require('express');
  const app = express();

  //Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
```

Setting up our post route

```javascript
  app.post('/question', (req, res) => {
    console.log(req.body)
  });
```

## Setting up MongoDB
- Set up an account on [mLab](https://mlab.com/)
- Set up mLab deployment
- Create a database user
- Grab the mongoDB URI
`mongodb://<dbuser>:<dbpassword>@ds239359.mlab.com:39359/devfeud`

Install our dependency
`yarn add mongodb`

Adding it to our `server.js` file
```javascript
  const MongoClient = require('mongodb').MongoClient;
  const mongoUrl = 'mongodb://<dbuser>:<dbpassword>@ds239359.mlab.com:39359/devfeud';

  let db;
  MongoClient.connect(mongoUrl, (err, database) => {
    if (err) return console.log(err);
    db = client.db('devfeud');

    // server listen here
  });
```


## Saving our Form Data
```javascript
  app.post('/question', (req, res) => {
    db.collection('questions').save(req.body, (error, result) => {
      if (error) return res.send(500, { error });

      console.log('saved to database');
      res.sendStatus(200);
    });
  });
```

## Retrieving our Saved Data
Now lets create an endpoint to retrieve our saved questions
```javascript
  app.get('/questions', (req, res) => {
    db
      .collection('questions')
      .find()
      .toArray(function(error, results) {
        if (error) return res.send(500, { error });

        res.send(results);
      });
  });
```

## Adding a New Collection
Now we need an endpoint to save our answers.
```javascript
  app.post('/answer', (req, res) => {
    db.collection('answers').save(req.body, (error, result) => {
      if (error) return res.send(500, { error });

      console.log('saved to database');
      res.sendStatus(200);
    });
  });
```

## Retrieving relational data
To retrieve the related answers we need to pass a query into the find function
```javascript
  app.get('/answers', (req, res) => {
    db
      .collection('answers')
      .find({ question_id: req.query.question })
      .toArray(function(error, results) {
        if (error) return res.send(500, { error });
        res.send(results);
      });
  });
```

## What Next?
* Linting
* Env Vars
* Validations
  * use typeof  to validate the fields
  * migrate to Mongoose and use Schemas
