const mongoose = require("mongoose")
let UrlShortener;

// creating a schema
const urlShortenerSchema = new mongoose.Schema({
  original_url: String,
  short_url: String,
});

// ceating a model
UrlShortener = mongoose.model("UrlShortener", urlShortenerSchema);

exports.UrlShortenerModel = UrlShortener;
