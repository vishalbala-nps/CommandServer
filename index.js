let app = require('express')();
let http = require('http').Server(app);
const cors = require('cors');
let io = require('socket.io')(http, {
   cors: {
       origin: ["http://localhost:3000","http://localhost:8080","http://192.168.1.13:3000","http://192.168.1.13:8080"]
   }
});
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");

let displayClients = [];
let controllers = []
app.use(cors());
io.adapter(createAdapter());
setupWorker(io);

app.get('/', function(req, res){
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

app.get('/getclients', function(req, res){
   let cl = [];
   displayClients.find(function(obj,index) {
      cl.push(obj.name)
   })
   return res.json({clients:cl})
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
   controllers.find(function(obj,index) {
      obj.sobj.emit("timer:start",req.query.name)
   })
   return res.json({text:"success"})
});
app.get('/stoptimer', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("timer:stop")
      }
   })
   controllers.find(function(obj,index) {
      obj.sobj.emit("timer:stop",req.query.name)
   })
   return res.json({text:"success"})
});
app.get('/resettimer', function(req, res){
   displayClients.find(function(obj,index) {
      if (obj.name === req.query.name) {
         obj.sobj.emit("timer:reset")
      }
   })
   controllers.find(function(obj,index) {
      obj.sobj.emit("timer:stop",req.query.name)
   })
   return res.json({text:"success"})
});
//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   socket.on('client:join', function (name) {
      displayClients.push({name:name,sobj:socket})
      socket.emit("join:success",name)
      controllers.find(function(obj,index) {
         obj.sobj.emit("client:join",name)
      })
   });
   socket.on('control:join', function (name) {
      controllers.push({name:name,sobj:socket})
      socket.emit("join:success",name)
   });
   socket.on('disconnect', function () {
      let leftname;
      displayClients.find(function(obj,index) {
         if (obj.sobj === socket) {
            leftname = obj.name
            console.log(obj.name+" disconnected")
            displayClients.splice(index,1)
            return true
         }
      })
      controllers.find(function(obj,index) {
         obj.sobj.emit("client:left",leftname)
      })
   });
   socket.on("timer:end",function(name) {
      console.log(name+" - timer is complete")
      controllers.find(function(obj,index) {
         obj.sobj.emit("timer:end",name)
      })
   })
   socket.on("req:hint",function(name) {
      console.log(name+" - requested for hint")
      controllers.find(function(obj,index) {
         obj.sobj.emit("req:hint",name)
      })
   })
});/*
http.listen(4000, function(){
   console.log('listening on *:4000');
});*/