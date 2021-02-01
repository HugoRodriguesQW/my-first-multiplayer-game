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

            ctx.rotate(players[p].rot*Math.PI/180);
            ctx.drawImage(resources.rockets.simple,
            -width/2, -height/2,
            width, height
            )
            ctx.restore ()

        }
    }

    function update() {

        if (resources.loaded === Object.keys(resources).length) {
            ctx.clearRect(camera.x, camera.y, camera.x + canvas.width, camera.y + canvas.height)
            camera.follow(state.players[playerId])
            ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y)

            renderPlayers()





        }
        window.requestAnimationFrame(update)
    }


    function start () {
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
    }
    start()
    window.requestAnimationFrame(update)
}