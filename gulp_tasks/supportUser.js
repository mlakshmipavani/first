'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util');
var args = require('yargs').argv;
var crypto = require('crypto');
var helper = require('./helpers');

var Promise = require('bluebird'),
    mongodb = require('mongodb'),
    MongoClient = Promise.promisifyAll(mongodb.MongoClient);

Promise.promisifyAll(mongodb.Collection.prototype);
Promise.promisifyAll(mongodb.Cursor.prototype);

gulp.task('support', function() {
    if (!args.uname || !args.pass) {
        gutil.log(gutil.colors.yellow('Usage : gulp support --uname jaydp17 --pass 123546 [--prod]'));
        return;
    }

    var config;
    if (args.prod) {
        config = helper.prodConfig();
    } else {
        config = {};
        config.MONGO_URL = 'mongodb://localhost:27017/stayyolo';
    }

    MongoClient.connectAsync(config.MONGO_URL)
        .then(function(db) {
            return newSupportUser(db, args.uname, args.pass);
        })
        .catch(function(err) {
            console.log('conenction error', err);
        });
});


function newSupportUser(db, userName, password) {
    var shasum = crypto.createHash('sha1');
    shasum.update(password);
    var user_obj = {
        mob_number: userName,
        password: shasum.digest('hex'),
        name: '',
        country_code: 'support',
        last_seen: new Date(),
        online: false,
        live: true,
        status: 'Stay Hungry Stay Foolish StayYolo',
        status_date: new Date(),
        friends: [],
        contacts: [],
        online_subscribers: [],
        created_at: new Date()
    };

    var find_user_obj = {
        mob_number: userName
    };

    var options = {
        upsert: true,
        returnOriginal: false
    };
    var coll = db.collection('users');
    var p = coll.findOneAndUpdateAsync(
        find_user_obj, {
            $setOnInsert: user_obj
        }, options
    ).then(function(resultObj) {
        if (!resultObj.value) {
            console.log('asdfsadf');
            console.log(resultObj);
            return p.cancel();
        }
        db.close();
    }).catch(function(err) {
        console.log('Mongo insert error:', err);
    });
    return p;
}