const express = require('express')
const app = express()
const server = require('http').createServer(app)
const sockets = require('socket.io')(server)

app.use(express.static('www'))

const game = makeGame()
let maxConnections = 15;

sockets.on('connection', function(socket){
  const socketId = socket.io
  if(sockets.engine.clientsCount <= (maxConnections+1)){
    const clientState = game.addClient(socketId)
  }else{
   socket.emit('max-connections-error', 'Máximo de conexões atingido. Tente mais tarde') 
   socket.conn.close()
  }
  socket.emit('bootstrap', game)
  
  socket.broadcast.emit('client-update', {
      socketId: socket.id,
      newState: game.clients[socket.id]
    })

  socket.on('disconnect', ()=> {
    game.removeClient(socketId)
    socket.broadcast.emit('client-remove', socket.id)
})
})


// Serve on port 8080
server.listen(3000, () => {
  console.log("Server: Listening on port: 3000")
})


function makeGame(){

  const game = {
    spawSize: 3000,
    clients: {},
    addClient,
    removeClient
  }

  function addClient(socketId){
    return game.clients[socketId] = {
      id: socketId,
      x: Math.floor(Math.random() * game.spawSize),
      y: Math.floor(Math.random() * game.spawSize),
    }
  }
  
  function removeClient(socketId){
    delete game.clients[socketId]
  }

  return game
}