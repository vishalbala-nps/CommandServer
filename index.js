var app = require('express')();
var http = require('http').Server(app);
const cors = require('cors');
var io = require('socket.io')(http, {
   cors: {
       origin: "http://localhost:3000"
   }
});

app.use(cors());

app.get('/', function(req, res){
   res.json({
      message: 'Hello world',
    });
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
   socket.on('message', function (msg) {
      console.log(msg);
   });
});
http.listen(4000, function(){
   console.log('listening on *:4000');
});