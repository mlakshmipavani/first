var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
    res.render('index', {
        title: 'YoloBots',
        useAnalytics: true
    });
});

router.get('/noanalytics', function(req, res) {
    res.render('index', {
        title: 'Yolo Messenger',
        useAnalytics: false
    });
});

router.get('/uber', function(req, res) {
  res.render('uber');
});

// Uncomment this to include terms and condition
// router.get('/terms',function(req,res){
// 	res.render('terms',{
// 		title: 'Yolo Terms and Conditions'
// 	});
// });

// Uncommnet this to include privacy policy
// router.get('/privacy',function(req,res){
//     res.render('privacy',{
//         title: 'Yolo Privacy Policy'
//     });
// });

module.exports = router;
