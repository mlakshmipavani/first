'use strict';


var gulp = require('gulp'),
    gutil = require('gulp-util'),
    exec = require('child_process').exec,
    helpers = require('./helpers'),
    tags = require('./dockertags'),
    spawn = require('child_process').spawn;



/** Docker build dev image */
gulp.task('docker.build', function() {
    docker.build('docker/dev/Dockerfile');
});

gulp.task('docker.buildMongo', function() {
    gutil.log(gutil.colors.green('There\'s no need to build Mongo, just run it'));
});

/** Docker build production image */
gulp.task('docker.build.prod', function() {
    docker.build('Dockerfile', true);
});

////////////////////////////////////////////////////////////
// -------------------- RUN Commands -------------------- //
////////////////////////////////////////////////////////////

/** Docker run in dev environment */
gulp.task('docker.run', function() {

    docker.stopContainer(tags.site, function() {
        docker.run(false, false);
    });
});

gulp.task('docker.runMongo', function() {
    docker.stopContainer(tags.mongo, function() {
        docker.runMongo();
    });
});



/////////////////////////////////////////////////////////////////
// -------------------- RUN prod Commands -------------------- //
/////////////////////////////////////////////////////////////////

/** Docker run in prod environment */
gulp.task('docker.run.prod', function() {
    docker.run(true, false);
});



/////////////////////////////////////////////////////////////
// -------------------- STOP Commands -------------------- //
/////////////////////////////////////////////////////////////

/** Stop mongo  */
gulp.task('docker.stopMongo', function() {
    docker.stopContainer(tags.mongo);
});



////////////////////////////////////////////////////////////
// -------------------- SSH Commands -------------------- //
////////////////////////////////////////////////////////////

/** Alias of docker.ssh */
gulp.task('docker.ssh', function() {
    docker.ssh(tags.site);
});

/** SSH into yolo container */
gulp.task('docker.ssh.site', function() {
    docker.ssh(tags.site);
});

/** SSH into mongo container */
gulp.task('docker.ssh.mongo', function() {
    docker.ssh(tags.mongo);
});



///////////////////////////////////////////////////////////////
// -------------------- REMOVE Commands -------------------- //
///////////////////////////////////////////////////////////////

gulp.task('docker.rm', function() {
    docker.removeNonRunning();
});

gulp.task('docker.rmi', function() {
    docker.removeNoneImages();
});


///////////////////////////////////////////////////////
// -------------------- Helpers -------------------- //
///////////////////////////////////////////////////////

/**
 * Docker Object to help with docker tasks
 */
var docker = {

    build: function(dockerfile, isProd, isDebugger) {
        var child = null;
        if (isProd) {
            child = spawn('docker', ['build', '-f', dockerfile, '-t', tags.siteProd, '--rm=true', '.']);
        } else if (isDebugger) {
            child = spawn('docker', ['build', '-f', dockerfile, '-t', tags.siteDebug, '--rm=true', '.']);
        } else {
            child = spawn('docker', ['build', '-f', dockerfile, '-t', tags.site, '--rm=true', '.']);
        }
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    },

    runMongo: function() {
        spawn('docker', ['run', '--name', tags.mongo, '-p', '27017:27017', '-d', 'mongo:3.0'], {
            stdio: 'inherit'
        });
    },

    run: function(isProd, isDebugger) {
        var config;
        if (isProd) {
            config = helpers.prodConfig();
        } else {
            config = helpers.devConfig();
        }

        // env variables
        var mongo_url = 'MONGO_URL=' + config.MONGO_URL;
        var bunyan_level = 'BUNYAN_LEVEL=' + config.BUNYAN_LEVEL;
        var npm_config = 'NPM_CONFIG_PRODUCTION=false';

        // ports
        var port = '80:80';
        var securePort = '443:443';

        // docker arguments
        var docker_args = [
            'run', '-it', '--rm', '-p', port, '-p', securePort
        ];
        if (!isProd) {
            docker_args.push('--link', tags.mongo + ':' + tags.mongo);
            if (isDebugger) {
                docker_args.push('-p', '8080:8080', '-p', '5858:5858');
            }
        }

        docker_args.push('-e', mongo_url, '-e', bunyan_level, '-e', npm_config);

        // if it's development envirnment put the source in a read-only volume
        if (isProd) {
            // finally specify the name of running image and the image to run
            docker_args.push('--name', tags.site, tags.siteProd);

        } else {
            docker_args.push('-v');
            docker_args.push(process.cwd() + ':/src:ro');

            if (isDebugger) {
                docker_args.push('--name', tags.site, tags.siteDebug);
            } else {
                docker_args.push('--name', tags.site, tags.site);
            }
        }


        // run it
        var child = spawn('docker', docker_args, {
            stdio: 'inherit'
        });

        // clean up
        child.on('close', function() {
            docker.removeNonRunning();
        });
    },

    ssh: function(tag) {
        spawn('docker', ['run', '--rm', '-t', '-i', tag, '/bin/bash'], {
            stdio: 'inherit'
        });
    },

    stopContainer: function(name, callback) {
        exec('docker stop ' + name, function() {
            docker.removeNonRunning(callback);
        });
    },

    removeNonRunning: function(callback) {
        // remove any non running containers
        exec('docker ps --no-trunc -aq', function(error, stdout, stderr) {
            if (stderr) {
                console.log('stderr:', stderr);
            }
            if (error === null) {
                if (stdout) {
                    // remove the containers
                    exec('docker rm ' + stdout, function() {
                        // after removing the images run the callback
                        if (callback) {
                            callback();
                        }
                    });
                } else {
                    if (callback) {
                        // if there's no output still run the callback
                        callback();
                    }
                }
            } else {
                gutil.log(gutil.colors.red('exec error:', error));
            }
        });
    },

    removeNoneImages: function() {
        // docker rmi `docker images --filter 'dangling=true' -q --no-trunc`
        exec('docker images --filter \'dangling=true\' -q --no-trunc', function(err, stdout, stderr) {
            if (err) {
                gutil.log(gutil.colors.red(err));
            } else {
                if (stdout) {
                    stdout = stdout.replace(/\n/g, ' ');
                    exec('docker rmi ' + stdout, function() {
                        gutil.log(gutil.colors.green('cleared!'));
                    });
                }
                if (stderr) {
                    gutil.log(gutil.colors.red(err));
                }
            }
        });
    }
};