export default function renderScreen(document, context, game, map, viewport) {

  const back_canvas = document.createElement('canvas');
  back_canvas.width = viewport.x;
  back_canvas.height = viewport.y;
  const ctx = back_canvas.getContext('2d');

  const Interface = []

  let zeroScreenPosition = { x: 0, y: 0 }

  const screenPositions = {
    'top-left-1': { x: 10, y: 30 },
    'top-left-2': { x: 10, y: 40 },
    'top-left-3': { x: 10, y: 50 },
    'middle-left': { x: 10, y: viewport.y / 2 },
    'bottom-center': { x: viewport.x / 2, y: viewport.y - 10 }
  }

  const defaultUiConfig = {
    value: 'empty',
    style: {
      fillStyle: 'white',
      font: '9px Nunito',
      textBaseline: 'middle'
    },
    position: zeroScreenPosition
  }

  class UI {
    constructor(id, position, value, style) {
      this.id = id
      this.value = value === undefined ? defaultUiConfig.value : value
      this.stl = CheckAndFixMissingKeys(style, defaultUiConfig.style)

      this.positionKey = position
      this.position = position === undefined ?
        defaultUiConfig.position :
        screenPositions[position]
    }
  }

  function addUI(values) {
    values.forEach((value) => {
      Interface.push(new UI(value.id, value.pos, value.val, value.style))
    })
  }

  function removeUI(IDs) {
    Interface.forEach((ui, num) => {
      IDs.forEach((receivedId) => {
        if (ui.id === receivedId) {
          Interface.splice(num, 1)
        }
      })
    })
  }

  function CheckAndFixMissingKeys(from, defaultKeys) {
    from = from === undefined ? {} : from
    const finalObject = from

    for (const key in defaultKeys) {
      if (from[key] === undefined) {
        finalObject[key] = defaultKeys[key]
      }
    }
    return finalObject
  }

  const bgStars = []
  const maxStarts = 100

  class star {
    constructor(x, y, size, color) {
      this.x = x
      this.y = y
      this.size = size
      this.color = color
    }
  }



  function updateScreenPositions(zeroPoint) {
    zeroScreenPosition.x = game.playerShip.x - viewport.x / 2
    zeroScreenPosition.y = game.playerShip.y - viewport.y / 2

    Interface.forEach((ui) => {
      const thisPos = screenPositions[ui.positionKey]
      ui.position = {
        x: zeroScreenPosition.x + thisPos.x,
        y: zeroScreenPosition.y + thisPos.y
      }
    })
  }



  function updateUI(datas) {
    updateScreenPositions()

    Interface.forEach((ui) => {
      datas.forEach((data) => {
        if (ui.id === data.id) {
          ui.value = data.value
        }
      })
    })
  }



  const animation = {
    interval: undefined,
    start: function(fps) {
      animation.interval = setInterval(update, 1000 / fps)
    },
    stop: function() {
      clearInterval(animation.interval)
    }
  }

  function update() {

    updateUI(game.exportData)
    DrawBackground()
    DrawStars()

    // These are requests for 'Draw' functions (Object)
    game.spaceShips.forEach((ship) => {
      DrawSpaceShips(ship)
    })

    game.particles.forEach((particle) => {
      DrawParticles(particle)
    })

    map.planets.forEach((planet) => {
      DrawPlanets(planet)
      PlanetsPointers(game.playerShip, planet)
    })

    // This render all UI in Interface (Array)
    Interface.forEach((ui) => {
      ctx.beginPath()
      for (const key in ui.stl) {
        ctx[key] = ui.stl[key]
      }
      ctx.fillText(ui.value, ui.position.x, ui.position.y)
    })
    context.drawImage(back_canvas, 0, 0)
  }



  function PlanetsPointers(center, planet) {


    const dist = Math.sqrt((planet.x - center.x) ** 2 + (planet.y - center.y) ** 2);
    if (dist < 10000) {

      const fromPos = center
      const toPos = planet

      const angle = Math.atan2(
        toPos.y - fromPos.y, toPos.x - fromPos.x)

      const corr = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      }

      const point = {
        x: center.x + ((viewport.x / 2.2) * corr.x),
        y: center.y + ((viewport.y / 2.2) * corr.y)
      }


      ctx.beginPath()
      ctx.fillStyle = `hsla(${planet.color}, 100%, 37%, 1)`
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, false)
      ctx.fill()

      ctx.beginPath()
      for (const key in defaultUiConfig.style) {
        ctx[key] = defaultUiConfig.style[key]
      }
      ctx.fillText((dist - planet.radius).toFixed(0), point.x + 5.5, point.y + 1.2);
    }
  }

  function backgroundStarsEngine() {

    const padding = 1.9
    const limits = {
      minX: game.playerShip.x - (viewport.x / padding),
      maxX: game.playerShip.x + (viewport.x / padding),
      minY: game.playerShip.y - (viewport.y / padding),
      maxY: game.playerShip.y + (viewport.y / padding)
    }

    for (let i = bgStars.length; i < (maxStarts * Math.random()); i++) {
      let color = 'white'
      if (Math.random() < 0.1) {
        color = `hsla(${Math.random()*360}, 100%, 65%, 1)`
      }

      bgStars.push(new star(
        game.playerShip.x - (viewport.x / padding) + (viewport.x * padding) * Math.random(),
        game.playerShip.y - (viewport.y / padding) + (viewport.y * padding) * Math.random(),
        Math.random() + 0.01, color
      ))
    }

    return limits
  }

  const CalcShipPoints = function(ship) {
    const p = [{
        x: ship.x + 4 / 3 * (ship.radius * Math.cos(ship.radian)),
        y: ship.y - 4 / 3 * (ship.radius * Math.sin(ship.radian))
      },

      {
        x: ship.x - ship.radius * (2 / 3 * Math.cos(ship.radian) + Math.sin(ship.radian)),
        y: ship.y + ship.radius * (2 / 3 * Math.sin(ship.radian) - Math.cos(ship.radian))
      },

      {
        x: ship.x - ship.radius * (2 / 3 * Math.cos(ship.radian) - Math.sin(ship.radian)),
        y: ship.y + ship.radius * (2 / 3 * Math.sin(ship.radian) + Math.cos(ship.radian))
      }
    ]
    return p
  }

  // All 'Draw' functions are here:
  function DrawSpaceShips(ship) {
    ctx.beginPath()
    ctx.lineWidth = ship.size / 20
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white'

    const points = CalcShipPoints(ship)
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }

  function DrawParticles(particle) {
    ctx.save()
    ctx.globalAlpha = particle.apha
    ctx.beginPath()
    ctx.fillStyle = Math.random() < 0.5 ? particle.colors[0] : particle.colors[1]

    ctx.arc(particle.x, particle.y,
      particle.radius < 0 ? particle.radius * -1 : particle.radius,
      0, Math.PI * 2, false)

    ctx.fill()
    ctx.restore()
  }

  function DrawPlanets(planet) {
    ctx.save()
    ctx.beginPath()
    let gradient = ctx.createRadialGradient(
      planet.x, planet.y, planet.radius / 4, planet.x, planet.y, planet.radius * 1.3);
    gradient.addColorStop(0, `hsla(${planet.color}, 100%, 65%, 1)`);
    gradient.addColorStop(1, `hsla(${planet.color}, 100%, 37%, 0.01)`);

    ctx.fillStyle = gradient
    ctx.arc(planet.x, planet.y, planet.radius * 1.6, 0, Math.PI * 2, false)
    ctx.fill();

    //draw a planet
    ctx.beginPath()
    gradient = ctx.createRadialGradient(
      planet.x * 0.77, planet.y * 0.75, planet.radius / 2, planet.x * 0.75, planet.y * 0.75, planet.radius * 1.75);
    gradient.addColorStop(0, `hsla(${planet.color}, 100%, 20%,1)`);
    gradient.addColorStop(1, `hsla(${planet.color}, 100%, 37%, 1)`);

    ctx.fillStyle = gradient
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.restore()
  }

  function DrawStars() {

    const limits = backgroundStarsEngine()

    bgStars.forEach((star, num) => {
      if (star.x < limits.minX || star.x > limits.maxX || star.y < limits.minY || star.y > limits.maxY) {
        bgStars.splice(num, 1)
      }
      else {
        ctx.beginPath()
        ctx.fillStyle = star.color
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2, false)
        ctx.fill()
      }
    })
  }

  function DrawBackground() {
    ctx.beginPath()
    context.clearRect(0, 0, viewport.x, viewport.y)

    ctx.clearRect(
      game.playerShip.x - viewport.x / 2,
      game.playerShip.y - viewport.y / 2,
      viewport.x, viewport.y
    )

    ctx.setTransform(1, 0, 0, 1, -game.cam.x, -game.cam.y)
  }

  return {
    animation,
    addUI,
    removeUI,
    Interface
  }

}
