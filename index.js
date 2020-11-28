const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.7ntnx.mongodb.net:27017,cluster0-shard-00-01.7ntnx.mongodb.net:27017,cluster0-shard-00-02.7ntnx.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-87jhz3-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});
console.log(process.env.DB_NAME);

client.connect((err) => {
  const foodCollection = client.db(process.env.DB_NAME).collection("foodItems");
  const orderCollection = client
    .db(process.env.DB_NAME)
    .collection("orderData");

  app.get("/foodItems", (req, res) => {
    foodCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
    
  app.get("/allOrders", (req, res) => {
    orderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
    
});

app.listen(process.env.PORT || 5000);
