require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("ecobazar");
    const dbs = client.db("simple");
    const contactCollection = db.collection("contact");
    const usersCollection = dbs.collection("users");
    

    app.post("/contact", async (req, res) => {
      try {
        const contact = req.body;

        const result = await contactCollection.insertOne(contact);

        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });
     app.get("/contact", async(req,res)=> {
      const {id}= req.params
      // const contact =req.body;
      const result = await contactCollection.find().toArray();
      res.json(result);
      
    })
    app.get("/users", async(req, res) => {
          const {id}= req.params
          const result = await usersCollection.find().toArray();
res.json(result);
  // res.send("all things are simple");
});
//         app.get("/contact", async (req, res) => {
//   const orders = await Order.find(); // MongoDB/Mongoose
//   res.json(orders);
// });
// app.get("/contact", async (req, res) => {
//   try {
//     const result = await contactCollection.find().toArray();

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });
// app.get("/contact", async (req, res) => {
//   const result = await contactCollection.find().toArray();
//   res.send(result);
// });

    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  }
}

run();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/simple", async(req, res) => {
          const result = await contactCollection.find().toArray();
res.json(result);
  res.send("all things are simple");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});