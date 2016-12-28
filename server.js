var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.Port || 3000);
console.log('server running');

app.use(express.static('public'));
// app.get('/',function(req,res){
//   res.sendFile(__dirname + '/public/index.html');
//   //res.sendFile(__dirname + '/Style/style.css');
// });

io.sockets.on('connection', function(socket){
  //on connect
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //on disconnect
  connections.splice(connections.indexOf(socket), 1);
  console.log('Disconected: %s sockets connected', connections.length);
})
