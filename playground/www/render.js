// Complete, insert render.update() in game.js

export default function renderScreen(document, canvas, game, map) {

  // TODO: Render a frame
  const ctx = canvas.getContext('2d')

  // What is a UI ?
  class UI {
    constructor(type, value) {
      this.type = type
      this.value = value
      this.target = document.getElementById(type)
    }

    update(newValue) {
      this.value = newValue
      this.target.innerHTML = this.value
    }
  }

  const Interface = []
  const toDisplay = { ds: [null] }

  // Add and Remove UI
  function addUI(ID, value) {
    Interface.push(new UI(ID, value))
  }

  function removeUI(ID) {
    Interface.forEach((UI, index) => {
      if (UI.type === ID) {
        Interface.splice(index, 1)
      }
    })
  }

  const animation = {
    interval: undefined
  }

  function start(fps, display) {
    toDisplay.ds = display
    animation.interval = setInterval(update, 1000 / fps)
  }

  function stop() {
    clearInterval(animation.interval)
  }

  function updateUI(fromGame) {
    Interface.forEach((ui) => {
      fromGame.forEach((ds) => {
        if (ui.type === ds.type) {
          ui.update(ds.value)
        }
      })
    })
  }

  // Draw Space, Ships and Planets
  function update() {

    updateUI(toDisplay.ds)

    ctx.beginPath()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, map.mapSize.width, map.mapSize.height)
    ctx.setTransform(1, 0, 0, 1, -game.cam.x, -game.cam.y)

    game.spaceShips.forEach((ship) => {
      ctx.beginPath()
      ctx.lineWidth = ship.size / 20
      ctx.strokeStyle = 'white'
      ctx.fillStyle = 'white'


      ctx.moveTo(
        ship.x + 4 / 3 * (ship.radius * Math.cos(ship.radian)),
        ship.y - 4 / 3 * (ship.radius * Math.sin(ship.radian))
      )

      ctx.lineTo(
        ship.x - ship.radius * (2 / 3 * Math.cos(ship.radian) + Math.sin(ship.radian)),
        ship.y + ship.radius * (2 / 3 * Math.sin(ship.radian) - Math.cos(ship.radian))
      )

      ctx.lineTo(
        ship.x - ship.radius * (2 / 3 * Math.cos(ship.radian) - Math.sin(ship.radian)),
        ship.y + ship.radius * (2 / 3 * Math.sin(ship.radian) + Math.cos(ship.radian))
      )

      ctx.closePath()
      ctx.stroke()
      ctx.fill()
    })

    game.particles.forEach((particle) => {
      ctx.save()
      ctx.globalAlpha = particle.apha
      ctx.beginPath()
      ctx.fillStyle = Math.random() < 0.5 ? particle.colors[0] : particle.colors[1]

      ctx.arc(particle.x, particle.y, particle.radius < 0 ? particle.radius * -1 : particle.radius, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.restore()
    })

    map.planets.forEach((planet) => {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.fill();
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, 20, 0, Math.PI * 2, false)

      var grd = ctx.createRadialGradient(
        planet.x, planet.y, planet.radius / 4, planet.x, planet.y, planet.radius * 1.3);
      grd.addColorStop(0, `hsla(${planet.color}, 100%, 65%, 1)`);
      grd.addColorStop(1, `hsla(${planet.color}, 100%, 37%, 0.01)`);

      ctx.fillStyle = grd
      ctx.arc(planet.x, planet.y, planet.radius * 1.6, 0, Math.PI * 2, false)
      ctx.fill();

      //draw a planet
      ctx.beginPath()
      grd = ctx.createRadialGradient(
        planet.x * 0.77, planet.y * 0.75, planet.radius / 2, planet.x * 0.75, planet.y * 0.75, planet.radius * 1.75);
      grd.addColorStop(0, `hsla(${planet.color}, 100%, 20%,1)`);
      grd.addColorStop(1, `hsla(${planet.color}, 100%, 37%, 1)`);

      ctx.fillStyle = grd
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2, false)
      ctx.fill()
    })
  }

  return {
    start,
    stop,
    addUI,
    removeUI,
    Interface
  }

}