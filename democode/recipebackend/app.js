var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');

require('./models/User');
require('./models/Recipe');
require('./models/Ingredient');

require('./config/passport');

mongoose.connect('mongodb://localhost/recipedb2', {  useMongoClient: true });

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', index);
app.use('/API/users', users);

// console.log(process.env.RECIPE_BACKEND_SECRET);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// function print (path, layer) {
//   if (layer.route) {
//     layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
//   } else if (layer.name === 'router' && layer.handle.stack) {
//     layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
//   } else if (layer.method) {
//     console.log('%s /%s',
//       layer.method.toUpperCase(),
//       path.concat(split(layer.regexp)).filter(Boolean).join('/'))
//   }
// }

// function split (thing) {
//   if (typeof thing === 'string') {
//     return thing.split('/')
//   } else if (thing.fast_slash) {
//     return ''
//   } else {
//     var match = thing.toString()
//       .replace('\\/?', '')
//       .replace('(?=\\/|$)', '$')
//       .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
//     return match
//       ? match[1].replace(/\\(.)/g, '$1').split('/')
//       : '<complex:' + thing.toString() + '>'
//   }
// }

// app._router.stack.forEach(print.bind(null, []))

module.exports = app;
