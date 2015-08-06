'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    helpers = require('./helpers'),
    tags = require('./dockertags'),
    spawn = require('child_process').spawn,
    tutumConfig = require('../config/tutum');

gulp.task('tutum.deploy', function() {
    deploy();
});


gulp.task('tutum.redeploy', function() {
    spawn('tutum', ['service', 'redeploy', tags.site + 'AWS'], {
        stdio: 'inherit'
    });
});

gulp.task('tutum.kill', function() {
    spawn('tutum', ['service', 'terminate', tags.site], {
        stdio: 'inherit'
    });
});


// not used anymore
gulp.task('tutum.push', function() {
    spawn('tutum', ['image', 'push', tags.site], {
        stdio: 'inherit'
    });
});


function getTutumImage(name) {
    return 'tutum.co/' + tags.username + '/' + name;
}


function deploy() {
    var config = helpers.prodConfig();
    spawn('tutum', ['service', 'run',
        '-e', 'PORT=' + config.PORT,
        '-e', 'MONGO_URL=' + config.MONGO_URL,
        '-e', 'BUNYAN_LEVEL=' + config.BUNYAN_LEVEL,
        '-p', config.PORT + ':' + config.PORT,
        '--tag', tutumConfig.tag,
        '--name', tags.site, tutumConfig.siteImage
    ], {
        stdio: 'inherit'
    });
}