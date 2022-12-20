import { Server } from "socket.io";



// const flag = (data) => {console.log('flag----------------->',data)}

//mongoose

import {mongoose} from 'mongoose'


async function mongodb(){
  await mongoose.connect('mongodb://127.0.0.1:27017/socket')
}


mongodb().catch(error => console.log(error))

const popUpSchema = new mongoose.Schema({
  description: {type: String,default: ''},
  viewed:{type: Boolean, default: false},
  createdDate: { type: Date, default: Date.now },
  receiverId : Number 
})

const popUp = mongoose.model('popUp',popUpSchema)



//mongoose




const io = new Server({
    cors:{
        origin:"http://localhost:3000"//Here goes your domain
    }
})



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
        const notification = new popUp({description:'connected',receiverId:user})
        await notification.save()
      }//Here we create a new notification to all users that have logged in
      
      io.emit("newNotification")
    })


    socket.on('getNotifications',async (userId) => {

      
      const notifications = await popUp.find({receiverId:userId})
      const receptor = getUser(userId)
      if(receptor)
        receptor.forEach(e => io.to(e).emit("sendNotifications",notifications))
    })

    socket.on("seen",async ({elementos,userId}) => {
      await popUp.updateMany({receiverId:userId},{viewed:true})
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


io.listen(5000); //Port number