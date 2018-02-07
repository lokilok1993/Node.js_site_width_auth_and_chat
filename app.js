// Подключение библиотек
var express = require('express');
var socket_io = require('socket.io');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var conf = require('./config');
var log = require('./ext/log');
var mongoose = require('mongoose');

var app = express();

var io = socket_io();
app.io = io;


// Настройка представлений
app.engine(conf.get('app-engine'), require('ejs-locals'));
app.set('views', path.join(__dirname, conf.get('app-view')));
app.set('view engine', conf.get('app-engine'));

mongoose.Promise = global.Promise

// Фавикон ( На всякий случай )
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Логи и парсер для тела http запросов
app.use(logger( conf.get('log-level') ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Настройка сессии
app.use( session({
  secret: conf.get('session:secret'),
  key: conf.get('session:key'),
  cookie: conf.get('session:cookie'),
  resave: true,
  saveUninitialized: true
}));

// Настройка статической папки ( Откуда беруться стили и изображения на сайте )
app.use(express.static(path.join(__dirname, conf.get('app-static'))));




// Настройки чата
var users = {};

function getUsers(obj){
  var tmp = [];
  for(var i in obj) tmp.push(obj[i]);
    return tmp.join(', ');
}

io.on('connection',function(client){
  client.on('send', function(data){
    io.sockets.emit('message', {message: data.message});
  });

  client.on('hello', function(data){
    client.nickname = data.name;
    client.emit('message', {message: '--- Добро пожаловать в чат, ' +data.name + '! ---'});
    client.broadcast.emit('message', {message: '--- '+ data.name + ' Присоеденился к чату ---'});
    
    if(Object.keys(users).length > 0){
      var userList = getUsers(users);
      client.emit('message', {message: '--- Уже в чате ' + userList + ' ---'})
    }else{
      client.emit('message', {message: "--- Кроме вас в чате никого нет ---"})
    }
    users[client.id] = data.name;
  });

  client.on('disconnect', function(data){
    if(Object.keys(users).length > 1){
        client.broadcast.emit('message', {message: "--- "+ client.nickname + " покинул чат ---"})
    }
    delete users[client.id];
  });
});


// Подключение контроллера
require('./routes')(app);


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
  res.locals.logged = req.session.user ? true : false;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
