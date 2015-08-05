'use strict';

var fs = require('fs'),
    dotenv = require('dotenv');

/**
 * Returns Development environment variables
 * @returns {Object}
 */
function devConfig() {
    return getConfig('.env.dev');
}

/**
 * Returns Production environment variables
 * @returns {Object}
 */
function prodConfig() {
    return getConfig('prod/.env.prod');
}

/**
 * Parses the given file and returns the config
 * @param {string} filename - path of the file
 * @returns {Object}
 */
function getConfig(filename) {
    var file = fs.readFileSync(filename);
    return dotenv.parse(file);
}

module.exports.devConfig = devConfig;
module.exports.prodConfig = prodConfig;
module.exports.getConfig = getConfig;