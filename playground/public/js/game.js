export default function createGame (gameSpeed) {

    console.log( '%c\uD83D\uDE80 Space Game Console \uD83D\uDE80', 'background-color: #03fc7f; margin: 0; padding: 0; font-size: 13px')

    const state = {
        players: {}
    }


    class rocket {
        constructor (setting) {
        this.x = setting.x || 0
        this.y = setting.y || 0
        this.rot = setting.rotation || 0

        this.particleEmitters = {}
        }
    }


    function addNewPlayer({id, x, y, rotation}) {
        console.info('%c GAME:', 'color: #03fc7f', `${id} connected.\n`, `x: ${x} \n`, `y: ${y} \n`, `rotation: ${rotation} \n`)
        const newplayer = new rocket({x, y, rotation})
        state.players[id] = newplayer
        return newplayer
    }

    function deletePlayer (id) {
        console.info('%c GAME:', 'color: #03fc7f', `${id} disconnected.\n`)
        delete state.players[id]
    }

    function addPlayerFunctions (playerId, {thrustSpeed, boosterSpeed}) {

            const player = state.players[playerId]

            player.thrustSpeed = thrustSpeed || 0.7
            player.boosterSpeed = boosterSpeed || 1.9
            player.thrust  = { x: 0, y: 0 }
            player.turn = 0

            player.controller = {
                thrusting: false,
                decreasing: false,
                rotateLeft: false,
                rotateRight: false,
                moveLeft: false,
                moveRight: false,
                heavyEngine: false,
            }

            player.move = function ()  {

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

                /// Apply Thruster and Turn ///
                player.x = player.x + player.thrust.x / gameSpeed
                player.y = player.y + player.thrust.y / gameSpeed
                player.rot = player.rot + player.turn /gameSpeed
            }

            player.emitters = function (actions) {

                // Remove disable emitters
                Object.keys(player.particleEmitters).map((name)=> {
                    if(player.controller[name] === false){
                        player.deleteEmitter(name)
                    }
                })
                // Add enable emitters
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

    return {
        state,
        addPlayerFunctions,
        addNewPlayer,
        deletePlayer
    }
}