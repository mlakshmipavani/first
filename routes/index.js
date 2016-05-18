var express = require('express');
var MobileDetect = require('mobile-detect');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res) {
  const md = new MobileDetect(req.headers['user-agent']);
  if (md.mobile()) {
    if (md.os() === 'AndroidOS') {
      let referrer = req.param('referrer') || '';
      referrer = encodeURIComponent(referrer);
      res.redirect(`market://details?id=com.stayyolo.app&${referrer}`);
    }
    else res.redirect('https://www.facebook.com/yolobotsHQ/');
  } else {
    res.render('index', {
      title: 'YoloBots',
      useAnalytics: true
    });
  }
});

router.get('/noanalytics', function (req, res) {
  res.render('index', {
    title: 'Yolo Messenger',
    useAnalytics: false
  });
});

router.get('/uber', function (req, res) {
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
