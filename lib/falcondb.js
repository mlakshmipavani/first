'use strict';

var Promise = require('bluebird'),
    mongodb = require('mongodb'),
    MongoClient = Promise.promisifyAll(mongodb.MongoClient);

Promise.promisifyAll(mongodb.Collection.prototype);
Promise.promisifyAll(mongodb.Cursor.prototype);

var db = null;

/**
 * This module is responsible for connecting to the main db and creating a user
 * @param {string} mongo_url - mongodb url
 * @returns {Promise}
 */
module.exports = function(mongo_url) {

    var connected = function(dbObj) {
        console.log('connected');
        db = dbObj;
    };

    var p = MongoClient.connectAsync(mongo_url)
        .then(connected)
        .catch(function(err) {
            console.log('conenction error', err);
            return p.cancel();
        });
    return p;
};

/**
 * Creates a new user in db
 * @param {string} mob_number - mobile number of the user
 * @param {string} country_code - country calling code (eg: '91' for India)
 * @returns {Promise}
 */
module.exports.newUser = function(mob_number, country_code) {
    var user_obj = {
        mob_number: mob_number,
        name: '',
        country_code: country_code,
        last_seen: new Date(),
        online: true,
        live: true,
        status: '',
        status_date: new Date(),
        friends: [],
        contacts: [],
        online_subscribers: [],
        created_at: new Date()
    };

    var find_user_obj = {
        mob_number: mob_number
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
            console.log(resultObj);
            return p.cancel();
        }
        return resultObj.value;
    }).catch(function(err) {
        console.log('Mongo insert error:', err);
    });
    return p;
};


/**
 * Lets support members login
 * @param  {string} userName - username of the support member
 * @param  {password} password - SHA1 hashed password
 * @return {Promise}
 */
module.exports.supportLogin = function(userName, password) {

    var find_obj = {
        mob_number: userName,
        password: password
    };

    var coll = db.collection('users');
    return coll.findOneAsync(find_obj);
};