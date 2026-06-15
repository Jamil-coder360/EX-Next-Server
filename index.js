require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mongo URI
const uri = process.env.MONGODB_URI;

// Mongo Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// DB cache (important for Vercel serverless)
let db;

// Connect DB once
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("ecobazar");
    console.log("MongoDB Connected");
  }
  return db;
}

/* ================= ROUTES ================= */

// Home route
app.get("/", (req, res) => {
  res.json({ message: "API Working Fine 🚀" });
});

// POST contact
app.post("/contact", async (req, res) => {
  try {
    const db = await connectDB();
    const contactCollection = db.collection("contact");

    const result = await contactCollection.insertOne(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET contact
app.get("/contact", async (req, res) => {
  try {
    const db = await connectDB();
    const contactCollection = db.collection("contact");

    const result = await contactCollection.find().toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET users
app.get("/users", async (req, res) => {
  try {
    const db = await client.db("simple");
    const usersCollection = db.collection("users");

    const result = await usersCollection.find().toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple test route
app.get("/simple", (req, res) => {
  res.send("Simple route working ✅");
});

/* ================= EXPORT (Vercel IMPORTANT) ================= */
module.exports = app;