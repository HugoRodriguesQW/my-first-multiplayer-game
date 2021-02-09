export default function createGame (gameSpeed) {

  const state = {
    players: {}
  }

  function addNewPlayer(id, setting) {

    const player = {
      x: Math.random()  * 500,
      y: Math.random() * 500,
      rot: Math.random() * 360,

      thrustSpeed : 0.5,
      boosterSpeed : 1.5,
      thrust  : { x: 0, y: 0 },
      turn : 0,

      particleEmitters : {},

      controller : {
        thrusting: false,
        decreasing: false,
        rotateLeft: false,
        rotateRight: false,
        moveLeft: false,
        moveRight: false,
        heavyEngine: false,
      }
    }

    Object.keys(setting).filter( (s) => {
      return typeof(setting[s]) === typeof(player[s])
    }).forEach( (s) => {
      player[s] = setting[s]
    })

    state.players[id] = player
    return state.players[id]
  }

  function deletePlayer (id) {
    delete state.players[id]
  }

  function addPlayerFunctions (id) {
    const player = state.players[id]

    player.emitters = function (actions) {    
      Object.keys(player.particleEmitters).map((name)=> {
        if(player.controller[name] === false){
          player.deleteEmitter(name)
        }
      })
      actions.forEach( (action) => {
        player.addEmitter(action)
      })
    }

    player.addEmitter = function (type) {
      player.particleEmitters[type] = 'active'
    }

    player.deleteEmitter = function (type) {
      delete player.particleEmitters[type]
    }
  }

  function movePlayer (id) {
    const player = state.players[id]

    const moveFunctions = {
      thrusting (p) {
        p.thrust.x = p.thrust.x + (p.thrustSpeed) * Math.sin(p.rot * Math.PI/180)
        p.thrust.y = p.thrust.y - (p.thrustSpeed) * Math.cos(p.rot * Math.PI/180)
      },
      decreasing (p) {
        p.thrust.x = p.thrust.x - (p.thrustSpeed) * Math.sin(p.rot * Math.PI/180)
        p.thrust.y = p.thrust.y + (p.thrustSpeed) * Math.cos(p.rot * Math.PI/180)
      },
      moveLeft (p) {
        p.thrust.x = p.thrust.x - (p.thrustSpeed) * Math.cos(p.rot * Math.PI/180)
        p.thrust.y = p.thrust.y - (p.thrustSpeed) * Math.sin(p.rot * Math.PI/180)
      },
      moveRight (p) {
        p.thrust.x = p.thrust.x + (p.thrustSpeed) * Math.cos(p.rot * Math.PI/180)
        p.thrust.y = p.thrust.y + (p.thrustSpeed) * Math.sin(p.rot * Math.PI/180)
      },
      heavyEngine (p) {
        p.thrust.x = (p.thrust.x) + (p.boosterSpeed) * Math.sin(p.rot * Math.PI/180)
        p.thrust.y = (p.thrust.y) - (p.boosterSpeed) * Math.cos(p.rot * Math.PI/180)
      },

      rotateLeft (p) {
        p.turn = p.turn - p.thrustSpeed
      },
      rotateRight (p) {
        p.turn = p.turn + p.thrustSpeed
      },
  }

  const actions = Object.keys(player.controller).filter((name) => {
      return player.controller[name] === true
  }).map((key) => {
      const moveFunction = moveFunctions[key]
      moveFunction(player)
      return key
  })

  player.emitters(actions)

  player.x = player.x + player.thrust.x / gameSpeed
  player.y = player.y + player.thrust.y / gameSpeed
  player.rot = player.rot + player.turn /gameSpeed

  }

  return {
    state,
    addPlayerFunctions,
    addNewPlayer,
    deletePlayer,
    movePlayer
  }
}