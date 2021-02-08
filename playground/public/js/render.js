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
        effects: {
            'smoke': './img/smoke.png',
            'fire': './img/fire.png',
            'white-fire': './img/white-fire.png'
        }
    }

    const screen = {

        /// Particles ///
        addParticle (name, particle) {
        if(this[name] === undefined) {
            this[name] = {particle: {}}
        }

        const id = Math.random().toFixed(8)
        Object.assign(particle, {lifetime: 1})
        this[name].particle[id] = particle

        },

        updateParticles (id) {
        if(this[id]){
            const emmiter = this[id].particle
            for(const p in emmiter) {
                const {x,y,w,h,src, rate} = emmiter[p]

                ctx.save()
                ctx.globalAlpha = emmiter[p].lifetime
                ctx.drawImage(resources.effects[src], x - (w/2), y - (h/2), w, h)
                ctx.globalAlpha = 1
                ctx.restore()

                emmiter[p].lifetime -= rate + (Math.random()/10)
                const sizeRate = Math.random() < .5? 0.1 : -0.1
                emmiter[p].w += sizeRate
                emmiter[p].h += sizeRate
                emmiter[p].x += emmiter[p].speed.x
                emmiter[p].y += emmiter[p].speed.y

                if(emmiter[p].lifetime < 0) {
                    delete emmiter[p]
                }
            }
        }
        }
    }


    function renderParticles (type, id)
    {
        ctx.beginPath ()

        const ref = {
            x :  - (143/8),
            y :  - (286/8),
        }

        const particleTypes = { // (O,O)  = center
            thrusting() {
                screen.addParticle(id, {
                    x: ref.x + 5.25, y: ref.y + 59.55,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.01, speed: {x:0, y: 1} })

                screen.addParticle(id, {
                    x: -ref.x - 5.25, y: ref.y + 59.55,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.01, speed: {x:0, y: 1} })
            },

            decreasing() {
                screen.addParticle(id, {
                    x: ref.x + 6, y: ref.y + 9,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.01, speed: {x:0, y: -1} })

                screen.addParticle(id, {
                    x: -ref.x - 6 , y: ref.y + 9,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.01, speed: {x:0, y: -1} })

            },

            rotateRight() {
                screen.addParticle(id, {
                    x: ref.x, y: ref.y + 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.1, speed: {x:-1, y: 0} })

                screen.addParticle(id, {
                    x: -ref.x, y: -ref.y - 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.1, speed: {x:1, y: 0} })

            },

            rotateLeft() {
                screen.addParticle(id, {
                    x: -ref.x, y: ref.y + 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.1, speed: {x:1, y: 0} })

                screen.addParticle(id, {
                    x: ref.x, y: -ref.y - 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.1, speed: {x:-1, y: 0} })
            },

            moveRight() {
                screen.addParticle(id, {
                    x: ref.x, y: ref.y + 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.07, speed: {x:-1, y: 0} })
                screen.addParticle(id, {
                    x: ref.x, y: -ref.y - 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.07, speed: {x:-1, y: 0} })
            },
            moveLeft() {
                screen.addParticle(id, {
                    x: -ref.x, y: ref.y + 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.1, speed: {x:1, y: 0} })
                    screen.addParticle(id, {
                    x: -ref.x, y: -ref.y - 20,
                    w: 4 + Math.random()*1.5 , h: 4 + Math.random()*1.5,
                    src: 'smoke', rate: 0.1, speed: {x:1, y: 0} })

            },

            heavyEngine() {
                 screen.addParticle(id, {
                    x: 0, y: -ref.y + 2,
                    w: 12 + Math.random()*1.5 , h: 12 + Math.random()*1.5,
                    src: 'fire', rate: 0.0001, speed: {x:0, y: 1}
                   })
                    screen.addParticle(id, {
                    x: 0, y: -ref.y + 2,
                    w: 12 + Math.random()*1.5 , h: 12 + Math.random()*1.5,
                    src: 'white-fire', rate: 0.0001, speed: {x:0, y: 1}
                    })
            }
        }

        const renderer = particleTypes[type]
        renderer()
        ctx.closePath()
    }

    function renderPlayers ()
    {
        const players = state.players
        for(const id in players) {

            ctx.save()
            const width = 143/4
            const height = 286/4

            ctx.translate(players[id].x + width/2, players[id].y + height/2)
            ctx.rotate(players[id].rot*Math.PI/180)

            screen.updateParticles(id)
            ctx.drawImage(resources.rockets.simple,
            -width/2, -height/2, width, height)

            Object.keys(players[id].particleEmitters).map( (type) => {
                renderParticles(type, id)
            })

            ctx.restore ()

        }
    }

    function renderInterface (from) {
        ctx.save()

        const render = {
            text({value, style, pos}){
                for(const prop in style){
                    ctx[prop] = style[propcd]
                }
                ctx.fillText(value, camera.x + pos[0], camera.y + pos[1])
            },
        }

        render.text({value: from.x.toFixed(2), pos: [25, 20], style:{direction: 'ltr', fillStyle: 'red', font: '13px Arial'}})
        render.text({value: from.y.toFixed(2), pos: [25, 35], style:{direction: 'ltr', fillStyle: 'green', font: '13px Arial'}})
        render.text({value: 'X:', pos: [10, 20], style:{direction: 'ltr', fillStyle: 'red', font: '13px Arial'}})
        render.text({value: 'Y:', pos: [10, 35], style:{direction: 'ltr', fillStyle: 'green', font: '13px Arial'}})

        for (const p in state.players) {
            render.text({value: p, pos: [canvas.width-20, 20 + (15 * Object.keys(state.players).indexOf(p))], style:{direction: 'rtl', fillStyle: 'white', font: '13px Arial'}})
        }

        ctx.restore()
    }

    function update() {

        if(state.players[playerId]) {

        ctx.clearRect(camera.x, camera.y, canvas.width, canvas.height)
        camera.follow(state.players[playerId])
        ctx.setTransform(1, 0, 0, 1, -camera.x, -camera.y)

        renderInterface(state.players[playerId])
        renderPlayers()

        }

        window.requestAnimationFrame(update)

    }


    async function start () {

        for(const type in resources) {
            await new Promise ( (accept) => {

                for (const res in resources[type]){

                    const resource = resources[type]
                    const image = new Image()
                    image.src = resource[res]
                    resource[res] = image

                    image.onload = function () {
                        const keys = Object.keys(resource)

                        if(keys.indexOf(res) === keys.length -1 ) {
                            accept()
                        }
                    }
                }
            })
        }

        update()
    }


    start()
}