var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gibson' });
});

router.get('/philosophy', function(req, res, next) {
  res.render('Philosophy', { title: 'Gibson' });
});

module.exports = router;
