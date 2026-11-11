const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')          // npm i cookie

let io
const connectedUsers = {}                 // userId -> socket.id

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    })

    // runs once per connection, before 'connection' fires
    io.use((socket, next) => {
        try {
            const raw = socket.handshake.headers.cookie || ''
            const { token } = cookie.parse(raw)
            if (!token) return next(new Error('Not authenticated'))

            socket.user = jwt.verify(token, process.env.JWT_SECRET)   // { userId }
            next()
        } catch (err) {
            next(new Error('Invalid or expired token'))
        }
    })

    io.on('connection', (socket) => {
        // register automatically, using the verified ID
        connectedUsers[socket.user.userId] = socket.id
        console.log('registered user', socket.user.userId)

        socket.on('disconnect', () => {
            if (connectedUsers[socket.user.userId] === socket.id) {
                delete connectedUsers[socket.user.userId]
            }
        })
    })

    return io
}

const getIO = () => io
const getConnectedUsers = () => connectedUsers

module.exports = { initSocket, getIO, getConnectedUsers }