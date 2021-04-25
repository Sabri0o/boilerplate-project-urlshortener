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

// importing modal
const UrlShortener = require("./dbSchema.js").UrlShortenerModel;

////Build a simple function to check if the url is valid or it is already exists in the db

var checkUrl = function (req, res, next) {
  console.log(req.body);

  const url = req.body["url"];

  var pattern = /^(http|https)/;
  var result = pattern.test(url);

  if (validUrl.isUri(url) && result) {
    console.log("Looks like an URI");
    console.log("check if uri exists in db...");
    UrlShortener.findOne({ original_url: url })
      .then((thatUrl) => {
        console.log("check this Url: ", thatUrl);
        if (thatUrl) {
          res.json({ original_url: url, short_url: thatUrl.short_url });
          return;
        } else {
          console.log("proceeding registration...");
          next();
        }
      })
      .catch((err) => {
        console.log("error: ", err);
        res.json({ error: "Database error" });
        return;
      });
  } else {
    console.log("Not a URI");
    res.json({ error: "invalid url" });
    return;
  }
};

app.post("/api/shorturl", checkUrl, function (req, res) {
  var uri = req.body["url"];
  var id = nanoid();
  var shortUrl = new UrlShortener({
    original_url: uri,
    short_url: id,
  });
  shortUrl.save(function (err, data) {
    if (err) console.log(err);
    console.log("url saved succefully");

    res.send({ original_url: uri, short_url: id });
  });
});

// get short url

app.get("/api/shorturl/:new?", function (req, res) {
  console.log(req.params.new);
  UrlShortener.findOne({ short_url: req.params.new })
    .then((thaturl) => {
      console.log(thaturl);
      if (thaturl) {
        res.redirect(thaturl.original_url);
      } else {
        res.json({ error: "No short URL found for the given input" });
      }
    })
    .catch((err) => console.log(err));
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
