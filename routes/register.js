'use strict';

var express = require('express');
var router = express.Router();

var request = require('request-promise');
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var falconDb = require('../lib/falcondb');

falconDb(process.env.MONGO_URL);

// the app posts auth headers here
// this will verify the headers with twitter then return the token
router.post('/', function(req, res) {
    var url = req.body['X-Auth-Service-Provider'];
    var headers = req.body['X-Verify-Credentials-Authorization'];

    var options = {
        url: url,
        headers: {
            'Authorization': headers
        },
        json: true
    };

    request(options).then(function(oAuthRes) {

        var mob_number = oAuthRes.phone_number;
        var phoneNumber = phoneUtil.parse(mob_number, '');
        var country_code = phoneUtil.getRegionCodeForNumber(phoneNumber);
        // remove the leading +
        mob_number = mob_number.substr(1);

        falconDb.newUser(mob_number, country_code).then(function(user_obj) {
            res.json({
                token: user_obj._id.toString(),
                name: user_obj.name
            });
        });
    }).catch(function(err) {
        console.log('error', err);
    });
});


/**
 * Lets the support members login using username password
 */
router.post('/support', function(req, res) {
    var userName = req.body.userName;
    var password = req.body.password;

    falconDb.supportLogin(userName, password).then(function(userObj) {
        var response = {
            valid: false,
            token: undefined
        };
        if (userObj) {
            response.valid = true;
            response.token = userObj._id.toString();
        }
        res.json(response);
    });
});

module.exports = router;