
var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.set('port', process.env.PORT || process.argv[2] || 3000);

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('wccr secret'));
app.use(express.session());
app.use(app.router);
app.use(express.static('client'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

fs.readdirSync(__dirname + '/routes').forEach(function (file) {
  require('./routes/' + file)(app);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});