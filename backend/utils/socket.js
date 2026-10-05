const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
})
const connectedUsers = {}

io.on('connection', (socket) => {
    console.log('User Connected:', socket.id)

    socket.on('register', (userId) => {
        connectedUsers[userId] = socket.id;
        console.log('registered user', userId)
    })
    socket.disconnect('disconnect', () => {
        Object.keys(connectedUsers).forEach(userId => {
            if (connectedUsers[userId] === socket.id) {
                delete connectedUsers[userId]
            }
        })
    })
})

module.exports = { io, connectedUsers }
