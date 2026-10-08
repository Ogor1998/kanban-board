
const { Server } = require('socket.io')
const http = require('http')

let io
const connectedUsers = {}

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        console.log('User Connected:', socket.id)

        socket.on('register', (userId) => {
            connectedUsers[userId] = socket.id
            console.log('registered user', userId)
        })

        socket.on('disconnect', () => {  // ← also fix socket.disconnect to socket.on
            Object.keys(connectedUsers).forEach(userId => {
                if (connectedUsers[userId] === socket.id) {
                    delete connectedUsers[userId]
                }
            })
        })
    })

    return io
}

const getIO = () => io
const getConnectedUsers = () => connectedUsers

module.exports = { initSocket, getIO, getConnectedUsers }