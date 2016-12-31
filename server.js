var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || CONFIG.port); 
console.log('server running');

app.use(express.static('public'));
app.use(express.static('public/Scripts/'));
app.use(express.static('public/Style/'));

io.sockets.on('connection', function(socket){
  //on connect
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //on disconnect
  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconected: %s sockets connected', connections.length);
  });
  // on message sent
  socket.on('send message', function(data){
    console.log(data);
    io.sockets.emit('new message',{msg:data, user:socket.username});
  });

  //new user
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
});
