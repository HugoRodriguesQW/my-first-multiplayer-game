import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import createGame from './public/js/game.js'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)
app.use(express.static('public'))

const game = createGame(60)

sockets.on('connection', (socket)=> {
  const socketId = socket.id
  console.info('> Connected:', socketId)

  game.addNewPlayer(socketId, {})
  notifyAll ('add-player', {
    id:socketId, values: game.state.players[socketId]
  })
  socket.emit('bootstrap', game.state)
  
  socket.on('disconnect', () => {
    console.info('> Disconnected:', socketId)
    game.deletePlayer(socketId)
    notifyAll ('delete-player', {
    id: socketId})
  })

  socket.on('apply-changes', ({key, values, command}) => {
    console.info('> changing', key, 'of', socketId)
    Object.assign(game.state.players[socketId][key], values)
    notifyAll(command, {id: socketId, key, values})
  })

  socket.on('scheduled-updates', ({values, command})=> {
    console.info('> scheduled',socketId, 'updates.')
    Object.assign(game.state.players[socketId], values)
    notifyAll(command, {id: socketId, values})
  })
})

function notifyAll (command, {id, key, values}) {
  sockets.emit(command, ({id, key, values}))
}

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})