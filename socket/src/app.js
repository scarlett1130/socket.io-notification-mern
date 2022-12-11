const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const socketio = require('socket.io');
const http = require("http");
const e = require('express');
require('./db.js');
const { Op, PopUp } = require("./db.js");
const app = express();
const cors = require("cors")


app.name = 'API';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/', routes);
// Error catching endware.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

const server = http.createServer(app);

const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let users = {}

const addUser = (userId, socketId) => {
  users[userId] ? users[userId] = [...users[userId],socketId] : users[userId] = [socketId]
}

const removeUser = (socketId) => {
  const asArray = Object.entries(users);
  let filtered = asArray.filter(([key, value]) => (value.includes(socketId)));
  if(filtered.length> 0 && filtered[0].length > 0)
    users[filtered[0][0]] = users[filtered[0][0]].filter(e => e!==socketId)
}

const getUser = (receiverId) => {
  return users[receiverId]
}

const getSocket = (socketId) => {
  const asArray = Object.entries(users);
  const filtered = asArray.filter(([key, value]) => value.includes(socketId));

  return Object.fromEntries(filtered)
}

io.on("connection", socket => {


  
    socket.on("addUser",async (userId) => {
      addUser(userId, socket.id)
      for(let user in users){
        const notification = await PopUp.create({
          type:'connected',
          ReceiverID: user
        })
      }//Here we create a new notification to all users that have logged in
      
      io.emit("newNotification")
    })


    socket.on('getNotifications',async (userId) => {
      const notificaciones = await PopUp.findAll({where:{ReceiverID:userId}})
      
      const receptor = getUser(userId)
      if(receptor)
        receptor.forEach(e => io.to(e).emit("sendNotifications",notificaciones))
    })

    socket.on("seen",async ({elementos,userId}) => {
      await PopUp.update({viewed:true},{where:{id:elementos}})
      const receptor = getUser(userId)
      
      if(receptor)
        receptor.forEach(e => io.to(e).emit("refreshSeen"))
    })


    socket.on("disconnect", async () => {
      
     
      
      const user = getSocket(socket.id)

      const userId = Object.keys(user)[0]
   
      if(socket.id && users)
        removeUser(socket.id)

      io.emit("getUsers", users)
    })
})

module.exports = server;