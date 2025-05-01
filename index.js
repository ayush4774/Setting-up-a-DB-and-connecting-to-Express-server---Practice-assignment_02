
require('dotenv').config();
const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const User = require('./schema');

const app = express();
const port = 3000;

const DB_URL = process.env.URL;

if (!DB_URL) {
  console.error("MongoDB connection URL is missing.");
  process.exit(1);
}

app.use(express.static('static'));
app.use(express.json()); // To parse JSON body

const connectdb = async () => {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

app.post('/api/users', async (req, res) => {
  try {
    const user_data = req.body;
    const new_user = new User(user_data);
    await new_user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating user", error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

connectdb().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
