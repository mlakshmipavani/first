const express = require('express');
const MobileDetect = require('mobile-detect');
const request = require('request-promise');
const router = express.Router();

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

router.get('/email-confirmed', (req, res) => {

  // send the page to the user
  res.render('email-confirmed', {
    name: req.query.name || 'there'
  });

  // tells the yolosFalcon server that the user has confirmed his email id
  request({
    url: `http://www.yolosfalcon.com/internal/email-confirmed/${req.query.id}`,
    method: 'POST'
  });
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
