import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import createGame from './public/js/game.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

console.log('starting server')

const game = createGame(60)

sockets.on('connection', (socket)=> {
  console.log('player connected: ' + socket.id)
  
  const player = game.addNewPlayer({id:socket.id})
  socket.emit('boot', game.state)
  sockets.emit('add-player', ({id: socket.id, state: player}))
  
  socket.on('disconnect', () => {
    game.deletePlayer(socket.id)
    console.log('player disconnected: ' + socket.id)

    sockets.emit('delete-player', (socket.id))
  })

  socket.on('change', ({id, key, values})=> {
    const tar = {}
    tar.id = id
    tar.key = key
    tar.values = values
    game.state.players[id][key] = values
    sockets.emit('move-player', (tar))
  })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})