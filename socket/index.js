import { Server } from "socket.io";

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



const io = new Server({
    cors:{
        origin:"http://localhost:3000"//Here goes your domain
    }
})

io.on("connection",(socket) => {
    console.log("A user is logged in")
    io.emit("logged", "A user is logged") //If you want to emit a event to a 
    //especific user, you may add it like:  socket.emit('event',)
    //When a usset is logged on your signin you have to add it to socket so you
    //can send it events, example: io.to(socketid).emit('event',{varaibles})
    //to get the socket id you has to assign it when a user logs in, associate the
    //user ID with a socket id, use the addUser function here so you can assign a 
    //user ID with multiple socket id, so the user gets the notifications in all active
    //tabs
    socket.on("disconnect",() =>{
        console.log("Someone has left")
        //here you have to remove the socket, only one socket associate with the tab,
        //to get the active socket, use "getSocket" function
    })
})


io.listen(5000); //Port number