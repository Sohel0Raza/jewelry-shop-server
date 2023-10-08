const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const req = require("express/lib/request");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q6zwl04.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jewelryCollection = client.db("jewelryShop").collection("allJewelry");

    app.get("/allJewelry", async (req, res) => {
      const cursor = jewelryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/allJewelry/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jewelryCollection.findOne(query);
      res.send(result);
    });

    app.post("/allJewelry", async (req, res) => {
      const newJewelry = req.body
      const result = await jewelryCollection.insertOne(newJewelry)
      res.send(result)
    })
    app.put("/allJewelry/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedJewelry = req.body;
      const jewelry = {
        $set: {
          jewelryName: updatedJewelry.jewelryName,
          price: updatedJewelry.price,
          weight: updatedJewelry.weight,
          description: updatedJewelry.description,
        },
      };
      const result = await jewelryCollection.updateOne(filter, jewelry, option);
      res.send(result);
    });
    app.delete("/allJewelry/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jewelryCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Sparkle Gems server is running...");
});

app.listen(port, () => {
  console.log(`Sparkle Gems server is running on port:${port}`);
});