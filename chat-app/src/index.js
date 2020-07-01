const express = require('express')
const http = require('http')
const path = require('path')
const socket = require('socket.io')
const Filter = require('bad-words')
const filter = new Filter()
const {messageGenerator, locationGenerator} = require('./utils/message')
const {getUser, removeUser, addUser, getUsersInRoom} = require('./utils/user')

var app = express()
const server = http.createServer(app)
const io = socket(server)

express.json()
//Be sure to give abs. path
app.use(express.static(path.join(__dirname,'../public')))

const updateUsers = (room) => {
    const users = getUsersInRoom(room)
    io.to(room).emit('updateUsers', {users, room})
}

io.on('connection', (socket) => {
    
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room})
        
        if(error) {
            return callback(error)
        }
        socket.join(room)

        socket.emit('message', messageGenerator('Welcome!', 'Admin'))
        socket.broadcast.to(room).emit('message', messageGenerator(`${name} has joined!`, "Admin"))
        updateUsers(room)
    })

    socket.on('message', (msg, fn) => {
        if(filter.isProfane(msg)) return fn({error: 'Using profane words are not allowed!'})
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('message', messageGenerator(msg, user.name))
        fn('Message sent successfully!')
    })

    socket.on('location', (latitude, longitude, fn) => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('locationShared', locationGenerator(latitude, longitude, user.name))
        fn()
    })

    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        removeUser(user.id)
        io.to(user.room).emit('message', messageGenerator(`${user.name} has left!`, user.name))
        updateUsers(user.room)
    })
})

server.listen((process.env.PORT || '3000'), () => {
    console.log('Server is up and running')
})
