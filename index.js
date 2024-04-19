let app = require('express')();
let http = require('http').Server(app);
const cors = require('cors');
let io = require('socket.io')(http, {
   cors: {
       origin: "http://localhost:3000"
   }
});
let clients = [];

app.use(cors());

app.get('/', function(req, res){
   clients.forEach(function(value) {
      console.log(value.name)
   })
   res.json({
      message: 'Hello world',
    });
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   socket.on('client:join', function (name) {
      clients.push({name:name,sobj:socket})
      socket.emit("join:success",name)
   });
   socket.on('disconnect', function () {
      clients.find(function(obj,index) {
         if (obj.sobj === socket) {
            console.log(obj.name+" disconnected")
            clients.splice(index,1)
            return true
         }
      })
   });
});
http.listen(4000, function(){
   console.log('listening on *:4000');
});