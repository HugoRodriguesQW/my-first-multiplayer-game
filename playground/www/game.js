// makeGravity, why?
// map, why?
// Viewport, why?

export default function createGame(makeGravity, map, viewport) {

  // FRAMES / SECONDS ( GAME SPEED )
  const fps = 60

  // CURRENT PLAYER CAMERA
  const cam = {
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    follow: function(target) {
      this.x = target.x - (viewport.width / 2)
      this.y = target.y - (viewport.height / 2)
    }
  }

  // GAME PREFABS
  class ship {
    constructor(position, size, rotation, turnSpeed, thrustSpeed, friction) {
      this.x = position.x
      this.y = position.y
      this.rotation = rotation
      this.radius = (size / 2)
      this.radian = (this.rotation / 180 * Math.PI)

      this.turn = turnSpeed
      this.thrusting = false
      this.decrease = false
      this.rotate = 0
      this.thrustSpeed = thrustSpeed == undefined ? 5 : thrustSpeed
      this.thrust = { x: 0, y: 0 }
      this.friction = friction == undefined ? 0.45 : friction

      this.mass = this.radius * 2
      this.velocity = { x: 0, y: 0 }
      this.theta = 0
      this.orbitHeight = 0
      this.dirCorretion = { x: 0, y: 0 }
      this.Orbiting = []
      this.alt = ''

    }

    move() {
      this.x = this.x + this.thrust.x
      this.y = this.y + this.thrust.y

      this.x = this.x + this.velocity.x
      this.y = this.y + this.velocity.y
    }

    engine() {
      if (this.thrusting) {
        this.thrust.x = this.thrust.x + this.thrustSpeed * Math.cos(this.radian) / fps
        this.thrust.y = this.thrust.y - this.thrustSpeed * Math.sin(this.radian) / fps
      }
      else if (this.decrease) {
        this.thrust.x = this.thrust.x - this.thrustSpeed * Math.cos(this.radian) / (fps * 2)
        this.thrust.y = this.thrust.y + this.thrustSpeed * Math.sin(this.radian) / (fps * 2)
      }
      this.move()
    }
  }

  class engineParticle {
    constructor(x, y, radius, colors, speed, alphaRate, friciton) {
      this.x = x
      this.y = y
      this.radius = radius
      this.colors = colors == undefined ? ['red', 'yellow'] : colors
      this.speed = speed
      this.apha = 1
      this.alphaRate = alphaRate
      this.friction = friciton == undefined ? 0.98 : friciton
    }

    update() {
      this.speed.x *= this.friction
      this.speed.y *= this.friction
      this.x = this.x + this.speed.x
      this.y = this.y + this.speed.y
      this.apha -= this.alphaRate + 0.1
    }
  } // END GAME PREFABS


  // GAME OBJECTS CREATE
  const playerShip = new ship({
    x: 15000,
    y: 15000
  }, 20, 90, 360, 2, 0.1)

  const spaceShips = []
  const particles = []
  const planets = []

  // GAME OBJECTS PUSH
  spaceShips.push(playerShip)
  map.planets.forEach((planet) => {
    planets.push(planet)
  })

  // Data Game (export)

  class data {
    constructor(id, value, target) {
      this.id = id
      this.value = value
    }
  }

  const exportData = [
    new data('campAlt'),
    new data('velX'),
    new data('velY'),
    new data('posX'),
    new data('posY')
  ]

  function renewData(id, newVal) {
    exportData.forEach((data) => {
      if (data.id === id) {
        data.value = newVal
      }
    })
  }

  setInterval(update, 1000 / fps)


  // UPDATE GAME
  function update() {

    // Display Update
    renewData('velX', (playerShip.thrust.x + playerShip.velocity.x).toFixed(1))
    renewData('velY', (playerShip.thrust.y + playerShip.velocity.y).toFixed(1))
    renewData('posX', (playerShip.x).toFixed(0))
    renewData('posY', (playerShip.y).toFixed(0))

    // SHIPS UPDATE
    moveShip(playerShip)
    borderMapShipCheck(playerShip)

    // CAMERA UPDATE
    cam.follow(playerShip)


    // CHECK OBJECTS APPROACH
    map.planets.forEach((planet, index) => {

      const dist = Math.hypot(Math.sqrt((planet.x - playerShip.x) ** 2 + (planet.y - playerShip.y) ** 2))

      if (dist - planet.radius < planet.orbitRange) {
        playerShip.Orbiting.push(planet);
        playerShip.alt = 'Altitude: ' + (dist - planet.radius).toFixed(1) + ' Km'
        renewData('campAlt', 'Altitude: ' + (dist - planet.radius).toFixed(1) + ' Km')
      }
      else if (playerShip.Orbiting.length == 0) {
        renewData('campAlt', ' ')
      }

    })

    playerShip.Orbiting = []


    // CHECK GRAVITY
    spaceShips.forEach((ship) => {

      map.planets.forEach((planet) => {

        const dist = Math.hypot(Math.sqrt((planet.x - ship.x) ** 2 + (planet.y - ship.y) ** 2))

        if (dist - planet.radius < planet.orbitRange) {
          makeGravity(playerShip, planet)
        }
      })
    })
  }

  function borderMapShipCheck(ship) {
    if (ship.x < 0 - ship.radius) {
      ship.x = map.mapSize.width
    }
    if (ship.x > map.mapSize.width + ship.radius) {
      ship.x = 0
    }
    if (ship.y < 0 - ship.radius) {
      ship.y = map.mapSize.height
    }
    if (ship.y > map.mapSize.height + ship.radius) {
      ship.y = 0
    }
  }

  // Insert Engine Particles
  function engineParticles(ship) {

    setTimeout(() => {
      // Remove Particles if alpha < 0
      particles.forEach((particle, index) => {
        if (particle.apha < 0) {
          particles.splice(index, 1)
        }
        else {
          particle.update()
        }
      })
    }, 0)

    // Main Engine
    if (ship.thrusting) {

      const posX = ship.x - ship.radius * 4 / 3 * Math.cos(ship.radian)
      const posY = ship.y + ship.radius * 4 / 3 * Math.sin(ship.radian)

      for (let i = 0; i < 5; i++) {

        particles.push(new engineParticle(
          posX + Math.random(), posY + Math.random(), Math.random() * (7 - (ship.thrust.x + ship.thrust.y) / 10), ['rgb(32, 159, 233)', 'rgb(149, 208, 247)'], { x: posX - (ship.x) + Math.random() * 2, y: posY - (ship.y) + Math.random() * 2 },
          0.4 * (Math.random() + 0.5)
        ))
      }
    }

    if (ship.decrease) {
      const posX = ship.x + ship.radius * 4 / 3 * Math.cos(ship.radian) * 1.2
      const posY = ship.y - ship.radius * 4 / 3 * Math.sin(ship.radian) * 1.2

      for (let i = 0; i < 5; i++) {

        particles.push(new engineParticle(
          posX, posY, Math.random() * (3 - (ship.thrust.x + ship.thrust.y) / 10), ['#ededed', '#c4c4c4'], { x: posX - (ship.x + ship.thrust.x) + Math.random() * 2, y: posY - (ship.y + ship.thrust.y) + Math.random() * 2 },
          0.9 * (Math.random() + 0.5), 0.39
        ))
      }
    }

    //Rotate Engines
    if (ship.rotation != 0) {
      const offset = ship.rotation > 0 ? -80 : 80
      const posX = ship.x + 4 / 3 * (ship.radius * Math.cos(ship.radian + offset))
      const posY = ship.y - 4 / 3 * (ship.radius * Math.sin(ship.radian + offset))

      for (let i = 0; i < 5; i++) {

        particles.push(new engineParticle(
          posX, posY, Math.random() * (3), ['#ededed', '#c4c4c4'], { x: posX - (ship.x + ship.thrust.x) - Math.random(), y: posY - (ship.y + ship.thrust.y) - Math.random() },
          0.9 * (Math.random() + 0.5), 0.28
        ))
      }
    }
  }

  // CONTROLLER AND SHIP MOVE
  const controller = {
    increaseSpeed: false,
    decreaseSpeed: false,
    rotateLeft: false,
    rotateRight: false,

    listen: function(command) {
      let isPressed = command.type === 'keydown' ? true : false

      switch (command.keyCode) {
        case 87:
          controller.increaseSpeed = isPressed
          break
        case 65:
          controller.rotateLeft = isPressed
          break
        case 68:
          controller.rotateRight = isPressed
          break
        case 83:
          controller.decreaseSpeed = isPressed
          break
      }
    }
  }

  document.addEventListener('keydown', controller.listen)
  document.addEventListener('keyup', controller.listen)


  function moveShip(ship) {
    if (controller.increaseSpeed) {
      ship.thrusting = true
    }
    else {
      ship.thrusting = false
    }
    if (controller.decreaseSpeed) {
      ship.decrease = true
    }
    else {
      ship.decrease = false
    }
    if (controller.rotateLeft) {
      ship.rotation = ship.turn / 180 * Math.PI / (fps * 1.2)
    }
    if (controller.rotateRight) {
      ship.rotation = -ship.turn / 180 * Math.PI / (fps * 1.2)
    }

    if (!controller.rotateLeft && !controller.rotateRight) {
      ship.rotation = 0
    }

    ship.radian = ship.radian + ship.rotation

    ship.engine()
    engineParticles(playerShip)
  }

  return {
    fps,
    cam,
    playerShip,
    spaceShips,
    planets,
    particles,
    exportData
  }

}
