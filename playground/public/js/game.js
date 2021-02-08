export default function createGame (gameSpeed) {

    const state = {
        players: {}
    }


    class rocket {
        constructor (setting) {
        this.x = setting.x === undefined? Math.random() * 700 : setting.x
        this.y = setting.y === undefined? Math.random() * 700 : setting.y
        this.rot = setting.rot === undefined? Math.random() * 360 : setting.rot

        this.particleEmitters = {}
        }
    }


    function addNewPlayer({id, x, y, rot}) {
        const newplayer = new rocket({x, y, rot})
        state.players[id] = newplayer
        return state.players[id]
    }

    function deletePlayer (id) {
        delete state.players[id]
        return ': )'
    }

    function addPlayerFunctions (id) {
            console.log('add functions ' + id)
            const player = state.players[id]
            player.thrustSpeed = 0.5
            player.boosterSpeed = 1.5
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


            return ': )'


    }

    return {
        state,
        addPlayerFunctions,
        addNewPlayer,
        deletePlayer
    }
}