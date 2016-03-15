'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var enforce = require('express-sslify');

var routes = require('./routes/index');
var subscribeRoutes = require('./routes/subscribe-beta');

var app = express();

// enforce HTTPS
app.use(enforce.HTTPS({trustAmazonHeader: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/subscribe', subscribeRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

var options = {
    key: fs.readFileSync('./ssl/private.key'),
    cert: fs.readFileSync('./ssl/2_www.yolobots.com.crt'),
    ca: [fs.readFileSync('./ssl/ca.crt')]
};

var securePort = process.env.SECURE_PORT || 443;
https.createServer(options, app).listen(securePort, function() {
    console.log('Express server listening on port ' + securePort);
});

var port = process.env.PORT || 80;
http.createServer(app).listen(port, function() {
    console.log('Express un encrypted server running on ' + port);
});

module.exports = app;
