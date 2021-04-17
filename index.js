const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x0gki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const businessCollection = client.db("businessTinker").collection("services");
  const reviewCollection = client.db("businessTinker").collection("reviews");
  app.post('/addService', (req, res) => {
    const addService = req.body;
    businessCollection.insertOne(addService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/services', (req, res) => {
    businessCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addReview', (req, res) => {
    const addReview = req.body;
    reviewCollection.insertOne(addReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
});

app.listen(process.env.PORT || port)