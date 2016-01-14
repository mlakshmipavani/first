'use strict';

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var nodeMailer = require('nodemailer');

var router = express.Router();

var db;
var coll;
var collName = 'betaList';
MongoClient.connect(process.env.MONGO_URL, {promiseLibrary: Promise})
  .then(function (dbObj) {
    db = dbObj;
    db.collection(collName, function (err, collObj) {
      if (err) throw err;
      coll = collObj;
    });
  })
  .catch(function (err) {
    console.log('error', err);
  });

var smtps = 'smtps://hello%40stayyolo.com:' + process.env.MAIL_PASS + '@mail.privateemail.com';
var transporter = nodeMailer.createTransport(smtps);

// setup e-mail data with unicode symbols
var mailOptions = {
  from: 'StayYolo <hello@stayyolo.com>', // sender address
  to: 'jaydp17@gmail.com, parthpatolia@gmail.com', // list of receivers
  subject: 'Beta Subscription Update', // Subject line
  html: ''  // html body
};

function getEmailText(/*string*/ email) {
  return 'Hello, <a href="mailto:' + email + '">' + email + '</a> has subscribed to YoloBots\' Beta Subscription';
}

router.post('/', function (req, res) {
  var email = req.body.email;
  return coll.insertOne({email: email, createdAt: new Date()})
    .then(function () {
      mailOptions.html = getEmailText(email);
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) return console.log(error);
      });
    })
    .then(function () {
      res.json({success: true});
    });
});

module.exports = router;
