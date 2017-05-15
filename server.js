var express=require('express');
var app=express();
var server=require('http').createServer(app);
app.use('/stylesheets',express.static(__dirname+'/stylesheets'));

var io=require('socket.io').listen(server);
users =[];
connections=[];
server.listen(process.env.PORT || 3000);
console.log('listning to port ');
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){
  connections.push(socket);//push used to add items to the array connections
  console.log('Connected: %s sockets connected',connections.length); //%s is the no. of connected sockets

  //Disconnect
  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket.username),1);
    updateUsers();
    connections.splice(connections.indexOf(socket),1);//removes a connection
    console.log('Disconnected: %s sockets connected',connections.length);
  });

  //message send
  socket.on('send message',function(data){
    console.log(data);
    io.sockets.emit('new message',{msg: data,name:socket.username,users:users});
  });

  //new user
  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(data);
    updateUsers();

  });

  function updateUsers(){
    io.sockets.emit('get users',users);
  }

});
