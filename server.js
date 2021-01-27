const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./public/js/messages')
const { userJoin,getCurrentUser,userLeave,getRoomUsers } = require('./public/js/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

io.on('connection', socket => {
    console.log("New socket connection")
    socket.on('joinRoom',({ username, room }) =>{

        
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        io.to(user.room).emit('active_users', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    
    socket.on('chatMessage',(msg) => {
        const user = getCurrentUser(socket.id)
        socket.broadcast.to(user.room).emit('message',formatMessage(`${user.username}`,msg))
    })
    
    socket.on('disconnect',() =>{
        const user = userLeave(socket.id)   
        if(user){
            io.to(user.room).emit('active_users', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))