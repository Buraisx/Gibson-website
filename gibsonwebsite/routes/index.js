var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gibson' });
});

router.get('/test', function(req, res, next) {
  res.render('test_waypoint');
});

router.get('/aboutus', function(req, res, next) {
  res.render('Aboutus', { title: 'Gibson' });
});

router.get('/philosophy', function(req, res, next) {
  res.render('Philosophy', { title: 'Gibson' });
});

router.get('/theteam', function(req, res, next) {
  res.render('Theteam', { title: 'Gibson' });
});

router.get('/financials', function(req, res, next) {
  res.render('Financials', { title: 'Gibson' });
});

router.get('/mediacentre', function(req, res, next) {
  res.render('Mediacentre', { title: 'Gibson' });
});

router.get('/hours', function(req, res, next) {
  res.render('Hours', { title: 'Gibson' });
});

router.get('/programs', function(req, res, next) {
  res.render('Programs', { title: 'Gibson' });
});

router.get('/community', function(req, res, next) {
  res.render('Community', { title: 'Gibson' });
});

router.get('/theteam', function(req, res, next) {
  res.render('Theteam', { title: 'Gibson' });
});

router.get('/forgotpassword', function(req, res, next) {
  res.render('forgotpassword', { title: 'Forgotten Password' });
});

router.get('/newpassword', function(req, res, next) {
  res.render('newpassword', { title: 'New Password' });
});

module.exports = router;
