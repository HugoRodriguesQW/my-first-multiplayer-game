const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.get('/', (req, res)=> {
  res.sendFile(__dirname+"/www/client.html")
})

const garden = createClientsObjects()


// If have a new client connection
io.on('connection', function(socket){
  const ClientState = garden.addPlayer(socket.id)
  socket.emit('bootstrap', garden)
})

socket.on('disconnect', () => {
    game.removePlayer(socket.id)
    socket.broadcast.emit('player-remove', socket.id)
  })

// Serve on port 8080
server.listen(8080, () => {
    console.log("Server: Listening on port: 8080")
})


// Create the Clients Garden
function createClientsObjects(){
  const garden = {
    clients:{},
    addClient,
    RemoveClient
  }

  function addClient(socketId){
    return garden.clients[socketId] = {
      id: socketId,
      number: io.engine.clientsCount
    }
  }

  function RemoveClient(socketId){
    delete garden.clients[socketId]
  }

  return garden
}