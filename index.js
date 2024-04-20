let app = require('express')();
let http = require('http').Server(app);
const cors = require('cors');
let io = require('socket.io')(http, {
   cors: {
       origin: "http://localhost:3000"
   }
});
let displayClients = [];

app.use(cors());

app.get('/', function(req, res){
   displayClients.forEach(function(value) {
      console.log(value.name)
   })
   res.json({
      message: 'Hello world',
    });
});

app.get('/addtext', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("text:add",req.query.text)
      }
   })
   return res.json({text:"success"})
});

app.get('/settimer', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("timer:set",req.query.time)
      }
   })
   return res.json({text:"success"})
});

app.get('/starttimer', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("timer:start")
      }
   })
   return res.json({text:"success"})
});
app.get('/stoptimer', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("timer:stop")
      }
   })
   return res.json({text:"success"})
});
app.get('/resettimer', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("timer:reset")
      }
   })
   return res.json({text:"success"})
});
//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   socket.on('client:join', function (name) {
      displayClients.push({name:name,sobj:socket})
      socket.emit("join:success",name)
   });
   socket.on('disconnect', function () {
      displayClients.find(function(obj,index) {
         if (obj.sobj === socket) {
            console.log(obj.name+" disconnected")
            displayClients.splice(index,1)
            return true
         }
      })
   });
   socket.on("timer:end",function(name) {
      console.log(name+" - timer is complete")
   })
   socket.on("req:hint",function(name) {
      console.log(name+" - requested for hint")
   })
});
http.listen(4000, function(){
   console.log('listening on *:4000');
});