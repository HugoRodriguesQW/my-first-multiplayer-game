export default function createGame (gameSpeed) {

    const state = {
        players: {}
    }


    class rocket {
        constructor (setting) {
        this.x = setting.x || 0
        this.y = setting.y || 0
        this.rot = setting.rotation || 0
        }
    }


    function addNewPlayer({id, x, y, rotation}) {
        console.log(id, x, y, rotation)
        const newplayer = new rocket({x, y, rotation})
        state.players[id] = newplayer
        return newplayer
    }


    function addPlayerFunctions (player, {thrustSpeed, boosterSpeed}) {


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
                        p.thrust.x = p.thrust.x + (p.thrustSpeed) * Math.cos(p.rot * Math.PI/180)
                        p.thrust.y = p.thrust.y - (p.thrustSpeed) * Math.sin(p.rot * Math.PI/180)
                    },
                    moveRight (p) {
                        p.thrust.x = p.thrust.x - (p.thrustSpeed) * Math.cos(p.rot * Math.PI/180)
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

                Object.keys(player.controller).filter((elemnt) => {
                    return player.controller[elemnt] === true
                }).map((key) => {
                    const moveFunction = moveFunctions[key]
                    moveFunction(player)
                })

                player.x = player.x + player.thrust.x / gameSpeed
                player.y = player.y + player.thrust.y / gameSpeed

                player.rot = player.rot + player.turn /gameSpeed
            }

    }

    function movePlayer (id) {
        state.players[id].move()
    }

    function rotatePlayer (id) {
        state.players[id].rotate()
    }

    function updatePlayer (id) {
        setInterval( () => {
            movePlayer(id)
            rotatePlayer(id)
        }, 1000 / gameSpeed)
    }


    return {
        state,
        addPlayerFunctions,
        addNewPlayer,
        movePlayer,
        rotatePlayer,
        updatePlayer
    }
}