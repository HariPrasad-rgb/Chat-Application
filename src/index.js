const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const{addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const app=express()
const publicDirPath=path.join(__dirname,'../public')
const server=http.createServer(app)//bit of refactoring
const io=socketio(server)
const {generateMessage,generateLocation}=require('./utils/messages')
let count=0

io.on('connection',(socket)=>///socket is an object that contains info abt the new connection
{
    socket.on('join',({username,room},callback)=>
    {
        const{error,user}=addUser({id:socket.id,username,room})
        if(error)
        {
           return callback(error)
        }

        socket.join(user.room)
        console.log('New Websocket connection')
      
        socket.emit('message',generateMessage('welcome','Admin'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`,'Admin')) 
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        
        callback()
    })
  
    socket.on('sendMessage',(message,callback)=>
    {
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(message,user.username))
        callback()
    })

    socket.on('disconnect',()=>
    {
      const user=  removeUser(socket.id)
      console.log(socket.id)
      console.log(user)
      if(user)
      {
        io.to(user.room).emit('message',generateMessage(`${user.username} has left !!`,'Admin'))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
      }
   
    })
    
    socket.on('sendLocation',((obj)=>
    {
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocation(`https://google.com/maps?q=${obj.latitude},${obj.longitude}`,user.username))
    }))

})



app.use(express.static(publicDirPath))

server.listen(3000,()=>
{
    console.log('Server up on Port 3000')
})