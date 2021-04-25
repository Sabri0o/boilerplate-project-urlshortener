require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// body useNewUrlParserconst fs = require("fs");
const bodyParser = require("body-parser");

// Node module that provides URI validation functions to verify a submitted URL.
const validUrl = require("valid-url");

//A tiny (108 bytes), secure, URL-friendly, unique string ID generator for JavaScript
const { nanoid } = require("nanoid");

// connecting database
const mySecret = process.env["MONGO_URI"];

let mongoose;
try {
  mongoose = require("mongoose");
} catch (error) {
  console.log(error);
}
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (error) {
    if (error) {
      console.log("Database error or database connection error " + error);
    }
    console.log("Database state is " + !!mongoose.connection.readyState);
  }
);

// Basic Configuration
const port = process.env.PORT || 3000;
// body parser middleware to handle the POST requests
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
