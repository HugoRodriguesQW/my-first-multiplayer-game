export default function renderScreen(document, ctx, game, map, viewport) {
	
  const Interface = []
  
  let zeroScreenPosition = {x:0, y: 0}
  const screenPositions = {
    'top-left-1': 	 zeroScreenPosition,
    'top-left-2':	 zeroScreenPosition,
    'top-left-3': 	 zeroScreenPosition,
    'middle-left':   zeroScreenPosition,
    'bottom-center': zeroScreenPosition
  }
  
  const defaultUiConfig = {
  	value : 'empty',
  	style : {
  		fillStyle: 'white',
  		font: '9px Nunito',
  		textBaseline: 'middle'
  	},
  	position : {
 	 x: zeroScreenPosition.x,
 	 y: zeroScreenPosition.y
  	}
  }
  
  class UI {
    constructor(id, position, value, style) {
      this.id = id
      this.position = position === undefined ? defaultUiConfig.position : position
      this.value = value === undefined ? defaultUiConfig.value  : value
      this.stl = style === undefined ? defaultUiConfig.style  : style
    }
  }

  function addUI(values) {
  	values.forEach((value) => {
    Interface.push(new UI(value.id, screenPositions[value.pos], value.val))
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

  const animation = {
    interval: undefined,
    start: function (fps) {
    	animation.interval = setInterval(update, 1000 / fps)
  	},
  	stop: function () {
    	clearInterval(animation.interval)
  	}
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
	
  function updateScreenPosition (zeroPoint)
  {
  	zeroScreenPosition.x = game.playerShip.x 
  	zeroScreenPosition.y = game.playerShip.y
  }
  
  function updateUI(datas) {
    Interface.forEach((ui) => {
      datas.forEach((data) => {
        if (ui.type === data.id) {
          ui.value = data.value
        }
      })
    })
  }

  // Draw Space, Ships and Planets
  function update() {
  	
	updateScreenPosition()
    updateUI(game.exportData)

    // Background
    ctx.beginPath()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, map.mapSize.width, map.mapSize.height)
    ctx.setTransform(1, 0, 0, 1, -game.cam.x, -game.cam.y)
    // Background

    // Background (Stars)
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

    bgStars.forEach((star, num) => {
      if (star.x < limits.minX || star.x > limits.maxX || star.y < limits.minY || star.y > limits.maxY) {
        bgStars.splice(num, 1)
      }
    })

    bgStars.forEach((star) => {
      ctx.beginPath()
      ctx.fillStyle = star.color
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2, false)
      ctx.fill()
    })
    // Background (Stars)

    // Interface Render
    Interface.forEach((ui) => {
      ctx.beginPath()
      ctx.fillStyle = 'white'
      ctx.font = '12px Nunito'
      ctx.textBaseline = 'middle'
      ctx.fillText(ui.value, ui.position.x, ui.position.y)
    })
    // Interface

    // Game
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

      PlanetsPointers(game.playerShip, planet)
    })
    // Game

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
      let point = {}

      if (toPos.x <= center.x) {

        point.x = center.x
        point.x = point.x + ((viewport.x / 2.2) * corr.x)


      }
      if (toPos.x > center.x) {

        point.x = center.x
        point.x = point.x + ((viewport.x / 2.2) * corr.x)

      }

      if (toPos.y <= center.y) {

        point.y = center.y
        point.y = point.y + ((viewport.y / 2.2) * corr.y)


      }
      if (toPos.y > center.y) {

        point.y = center.y
        point.y = point.y + ((viewport.y / 2.2) * corr.y)

      }


      ctx.beginPath()
      ctx.fillStyle = `hsla(${planet.color}, 100%, 37%, 1)`
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, false)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = 'white';
      ctx.font = '9px Nunito';
      ctx.textBaseline = 'middle'
      ctx.fillText(dist.toFixed(0), point.x + 5.5, point.y + 1.2);
    }
  }

  return {
   	animation,
    addUI,
    removeUI,
    Interface
  }

}
