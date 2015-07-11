var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Yolo Messenger',
        useAnalytics: true
    });
});

router.get('/noanalytics', function(req, res) {
    res.render('index', {
        title: 'Yolo Messenger',
        useAnalytics: false
    });
});

module.exports = router;