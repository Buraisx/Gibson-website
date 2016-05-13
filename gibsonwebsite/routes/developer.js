var express = require('express');
var router = express.Router();
var config = require('../server_config');
var jwt = require('jsonwebtoken');

router.get('/developer', function(req, res) {
    res.render('developer', {title: 'LEL'});
});

module.exports = router;
