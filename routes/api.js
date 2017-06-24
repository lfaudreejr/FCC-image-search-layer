var express = require("express");
var router = express.Router();
var request = require("request");
require("dotenv").config();

var historyArr = [];
function historyFn(term) {
  this.term = term;
  this.when = new Date();
}

/* GET */
router.get("/", function(req, res, next) {
  res.redirect("index");
});
router.get("/imagesearch", function(req, res, next) {
  res.redirect("index");
});
/* GET latest */
router.get("/latest/imagesearch", function(req, res, next) {
  console.log(historyArr);
  res.send(historyArr);
});

/* GET imagesearch query */
router.get("/imagesearch/:query", function(req, res, next) {
  var search = req.params.query;
  var num = req.query.offset || 1;
  var key = process.env.google;
  var cx = process.env.cx;

  var historyObj = new historyFn(search);
  historyArr.push(historyObj);
  console.log(historyArr);
  var url =
    "https://www.googleapis.com/customsearch/v1?key=" +
    key +
    "&cx=" +
    cx +
    "&q=" +
    search +
    "&num=10&start=" +
    num +
    "&alt=json&searchType=image";

  // Make a request to the url
  request(url, function(err, response, body) {
    if (err) {
      console.log(err);
      res.redirect("/imagesearch");
    }
    var bod = JSON.parse(body);
    // Constructor to create a new obj for each item recieved
    function newObj(link, snip, thumb, image) {
      this.link = link;
      this.snippet = snip;
      this.thumbnail = thumb;
      this.image = image;
    }

    // Create a new objects to return with api data
    const returnArr = [];
    bod["items"].forEach(function(element) {
      return returnArr.push(
        new newObj(
          element.link,
          element.snippet,
          element.image.thumbnailLink,
          element.image.contextLink
        )
      );
    }, this);

    // var showArr = Array(num).fill(re)

    res.send(JSON.stringify(returnArr));
  });
});

module.exports = router;
