export default function makeRender(state, playerId)
{
    const canvas = document.getElementById('game-area')
    canvas.width = innerWidth
    canvas.height = innerHeight
    const ctx = canvas.getContext('2d')

    const camera = {
    x: 0,
    y: 0,
    follow: function (target) {
      this.x = target.x - (canvas.width / 2)
      this.y = target.y - (canvas.height / 2)
    }
  }

    const resources = {
        rockets: {
            simple: './img/rocket.png'
        },

        loaded: 1
    }

    function renderParticles (type)
    {
        ctx.beginPath ()

        const ref = {
            x :  - (143/8),
            y :  - (286/8),
        }

        const particleTypes = { // (O,O)  = center
            thrusting() {
                ctx.fillStyle = 'red'
                ctx.arc(ref.x + 5.25 , ref.y + 59.25, 1, 0, 2 * Math.PI)
                ctx.arc(-ref.x - 5.25 , ref.y + 59.25, 1, 0, 2 * Math.PI)
                ctx.fill()
            },
            decreasing() {
                ctx.fillStyle = 'red'
                ctx.arc(ref.x + 6, ref.y + 8.5, 1, 0, 2 * Math.PI)
                ctx.arc( -ref.x - 6 , ref.y + 8.5, 1, 0, 2 * Math.PI)
                ctx.fill()
            },
            rotateRight() {
                ctx.fillStyle = 'red'
                ctx.arc(ref.x, ref.y + 20, 1, 0, 2 * Math.PI)
                ctx.arc( -ref.x, -ref.y - 20, 1, 0, 2 * Math.PI)
                ctx.fill()
            },
            rotateLeft() {
                ctx.fillStyle = 'red'
                ctx.arc(-ref.x, ref.y + 20, 1, 0, 2 * Math.PI)
                ctx.arc( ref.x, -ref.y - 20, 1, 0, 2 * Math.PI)
                ctx.fill()
            },
            moveLeft() {
                ctx.fillStyle = 'red'
                ctx.arc(-ref.x, ref.y + 20, 1, 0, 2 * Math.PI)
                ctx.arc( -ref.x, -ref.y - 20, 1, 0, 2 * Math.PI)
                ctx.fill()
            },
            moveRight() {
                ctx.fillStyle = 'red'
                ctx.arc(ref.x, ref.y + 20, 1, 0, 2 * Math.PI)
                ctx.arc( ref.x, -ref.y - 20, 1, 0, 2 * Math.PI)
                ctx.fill()
            },
            heavyEngine() {
                ctx.fillStyle = 'red'
                ctx.arc(0, -ref.y + 5, 5, 0, 2 * Math.PI)
                ctx.fill()
            }
        }

        const renderer = particleTypes[type]
        renderer()
        ctx.closePath()
    }

    function renderPlayers ()
    {
        const players = state.players
        for(const p in players) {

            ctx.save()
            const width = 143/4
            const height = 286/4
            ctx.translate(
                players[p].x + width/2, players[p].y + height/2,
            )

            ctx.rotate(players[p].rot*Math.PI/180)

            ctx.drawImage(resources.rockets.simple,
            -width/2, -height/2,
            width, height
            )

            Object.keys(players[p].particleEmitters).map( (type, ind) => {
                renderParticles(type)

                //TODO: Remove later (console)
                ctx.beginPath()
                ctx.fillStyle= 'white'
                ctx.fillText(type, 30, 35.7 + (10*ind))
                ctx.closePath()
            })
            ctx.restore ()

        }
    }

    function update() {

        if(state.players[playerId]) {
        ctx.clearRect(camera.x, camera.y, camera.x + canvas.width, camera.y + canvas.height)
        camera.follow(state.players[playerId])
        ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y)

        renderPlayers()

        }

        window.requestAnimationFrame(update)

    }


    async function start () {
        const rockets = resources.rockets
        for (const r in rockets) {
            const local = rockets[r]
            const rocket = new Image()
            rocket.src = local
            resources.rockets[r] = rocket
            rocket.onload = function () {
                resources.loaded++
            }
        }

        function checkLoadedResources () {
            return new Promise ( (accept) => {
                const checker = setInterval ( ()=> {
                if( resources.loaded === Object.keys(resources).length) {
                    accept()
                    clearInterval(checker)
                }
                }, 100)
            })
        }

        await checkLoadedResources ()
        update()
    }


    start()
    window.requestAnimationFrame(update)
}