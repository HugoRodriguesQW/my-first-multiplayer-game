const express = require('express')
const app = express()
const server = require('http').createServer(app)
const sockets = require('socket.io')(server)

app.get('/', (req, res)=> {
  res.sendFile(__dirname+"/www/client.html")
})

const garden = createGarden()

sockets.on('connection', function(socket){
  const socketId = socket.id
  console.log('!Conected: '+socketId)
  const clientState = garden.addClient(socketId)
  socket.emit('bootstrap', garden)
  
  socket.on('disconnect', ()=> {
    console.log('!Desconected: '+socketId)
    garden.removeClient(socketId)
})
})


// Serve on port 8080
server.listen(3000, () => {
  console.log("Server: Listening on port: 3000")
})


function createGarden(){
  const garden = {
    canvasWidth: 35,
    canvasHeight: 30,
    clients: {},
    addClient,
    removeClient
  }

  function addClient(socketId){
    return  garden.clients[socketId] = {
      id: socketId,
      x: Math.floor(Math.random() * garden.canvasWidth),
      y: Math.floor(Math.random() * garden.canvasHeight),
    }
  }
  
  function removeClient(socketId){
    delete garden.clients[socketId]
    console.log('!Deleted: '+socketId)
  }

  return garden
}