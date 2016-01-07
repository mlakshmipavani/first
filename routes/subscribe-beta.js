'use strict';

var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

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

router.post('/', function (req, res) {
  var email = req.body.email;
  return coll.insertOne({email: email, createdAt: new Date()}).then(function () {
    res.json({success: true});
  });
});

module.exports = router;
