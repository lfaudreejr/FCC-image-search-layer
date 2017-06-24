var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Image Search Abstraction Layer by: Larry Faudree"
  });
});

module.exports = router;
