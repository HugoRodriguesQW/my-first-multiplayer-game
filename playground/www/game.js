export default function createGame(makeGravity, map, controller) {

  // FRAMES / SECONDS ( GAME SPEED )
  const fps = 60


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
      this.thrustSpeed = thrustSpeed || 5
      this.thrust = { x: 0, y: 0 }
      this.friction = friction || 0.45

      this.mass = this.radius * 4
      this.velocity = { x: 0, y: 0 }
      this.theta = 0
      this.orbitHeight = 0
      this.dirCorretion = { x: 0, y: 0 }
      this.Orbiting = []
      this.alt = ''

      this.guns = []
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

      if (this.decrease) {
        this.thrust.x = this.thrust.x - (this.thrustSpeed / 4) * Math.cos(this.radian) / fps
        this.thrust.y = this.thrust.y + (this.thrustSpeed / 4) * Math.sin(this.radian) / fps
      }
      this.move()
    }

    manageGuns(action, gun) {
      switch (action) {
        case 'add':
          this.guns.push(gun)
          break
        case 'remove':
          this.guns.splice(gun, 1)
      }
    }
  }

  class bullet {
    constructor(x, y, speed) {
      this.x = x
      this.y = y
      this.velocity = {
        x: speed.x,
        y: speed.y
      }
    }

    move() {
      this.x += this.velocity.x / fps
      this.y += this.velocity.y / fps
    }
  }

  class gun {
    constructor(rate, bulletSpeed) {
      this.x = 0
      this.y = 0

      this.bulletSpeed = bulletSpeed || 1200 // Km/s

      this.enableToShoot = true
      this.rate = rate || 0.5 // Seconds

      this.shoots = []
    }
    requestDestructBullets(id) {
      for (const child in this.shoots) {
        if (id === this.shoots[child].id) {
          this.shoots.splice(child, 1)
        }
      }
    }

    update(shoot) {
      let time = 0
      const up = setInterval(() => {
        shoot.move()
        time += 1 / fps
        if (time >= 1) {
          this.requestDestructBullets(shoot.id)
          clearInterval(up)
        }
      }, 1000 / fps)
    }

    reload() {
      let time = 0
      const itval = setInterval(() => {
        time += 1 / fps
        if (time >= this.rate) {
          clearInterval(itval)
          this.enableToShoot = true
        }
      }, 1000 / fps)
    }

    fire(parent, ammunition) {

      const bullet = new ammunition(
        parent.x + 4 / 3 * (parent.radius * Math.cos(parent.radian)),
        parent.y - 4 / 3 * (parent.radius * Math.sin(parent.radian)), {
          x: parent.thrust.x + (Math.cos(parent.radian + parent.thrust.x / 100) * this.bulletSpeed),
          y: parent.thrust.y - (Math.sin(parent.radian + parent.thrust.y / 100) * this.bulletSpeed)
        }
      )

      const bulletId = this.shoots.length
      bullet.id = `${bulletId} bullet`

      this.shoots.push(bullet)
      this.enableToShoot = false
      this.update(this.shoots[bulletId])
      this.reload()
    }
  }


  class engineParticle {
    constructor(x, y, radius, colors, speed, alphaRate, friciton) {
      this.x = x
      this.y = y
      this.radius = radius
      this.colors = colors || ['red', 'yellow']
      this.speed = speed
      this.apha = 1
      this.alphaRate = alphaRate
      this.friction = friciton || 0.98
    }

    update() {
      this.speed.x *= this.friction
      this.speed.y *= this.friction
      this.x = this.x + this.speed.x
      this.y = this.y + this.speed.y
      this.apha -= this.alphaRate + 0.1
    }
  }


  const playerShip = new ship({ x: 100, y: 100 },
    20, 90, 360, 2, 0.1)

  playerShip.guns.push(
    new gun(0.15)
  )

  const spaceShips = [playerShip]
  const particles = []
  const planets = map.planets

  class data {
    constructor(id, value) {
      this.id = id
      this.value = value
    }
  }


  const exportData = [
    new data('campAlt'),
    new data('velX'),
    new data('velY'),
    new data('posX'),
    new data('posY'),
    new data('planetOrbiting')
  ]


  function renewData(id, newVal) {
    for (const data in exportData) {
      if (exportData[data].id === id) {
        exportData[data].value = newVal
      }
    }
  }




  function update() {

    // Display Update
    renewData('velX', `X: ${(playerShip.thrust.x + playerShip.velocity.x).toFixed(1)} Km/s`)
    renewData('velY', `Y: ${(playerShip.thrust.y + playerShip.velocity.y).toFixed(1)} Km/s`)
    renewData('posX', `< ${(playerShip.x).toFixed(0)} X >`)
    renewData('posY', `< ${(playerShip.y).toFixed(0)} Y >`)

    // SHIPS UPDATE
    moveShip(playerShip)
    GunsEngine(playerShip)

    // CHECK OBJECTS APPROACH
    map.planets.forEach((planet) => {

      const dist = Math.hypot(Math.sqrt((planet.x - playerShip.x) ** 2 + (planet.y - playerShip.y) ** 2))

      if (dist - planet.radius < planet.orbitRange) {
        playerShip.Orbiting.push(planet);
        playerShip.alt = 'Altitude: ' + (dist - planet.radius).toFixed(1) + ' Km'
        renewData('campAlt', 'Altitude: ' + (dist - planet.radius).toFixed(1) + ' Km')
        renewData('planetOrbiting', planet.name)
      }
      else if (playerShip.Orbiting.length == 0) {
        renewData('campAlt', ' ')
        renewData('planetOrbiting', ' ')
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

  setInterval(update, 1000 / fps)

  function GunsEngine(ship) {
    if (controller.shooting.is) {
      for (const gun in ship.guns) {
        if (ship.guns[gun].enableToShoot) {
          ship.guns[gun].fire(ship, bullet)
        }
      }
    }
  }

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

    borderMapShipCheck(playerShip)
  }

  const cases = {
    outsideVertical: (posY) => {
      return posY < 1 ? 'top' : posY > map.mapSize.height - 1 ? 'bottom' : false
    },
    outsideHorizontal: (posX) => {
      return posX < 1 ? 'left' : posX > map.mapSize.width - 1 ? 'right' : false
    },
  }

  function borderMapShipCheck(ship) {

    switch (cases.outsideVertical(ship.y)) {
      case 'top':
        ship.y = map.mapSize.height - ship.radius * 2
        break
      case 'bottom':
        ship.y = 0 + ship.radius * 2
    }

    switch (cases.outsideHorizontal(ship.x)) {
      case 'left':
        ship.x = map.mapSize.width - ship.radius * 2
        break
      case 'right':
        ship.x = 0 + ship.radius * 2
    }
  }

  const deltaParticles = {
    colors: {
      main: ['rgb(32, 159, 233)', 'rgb(149, 208, 247)'],
      gases: ['#ededed', '#c4c4c4']
    }
  }

  function engineParticles(ship) {

    setTimeout(() => {
      particles.forEach((particle, index) => {
        if (particle.apha < 0) {
          particles.splice(index, 1)
        }
        else {
          particle.update()
        }
      })
    }, 0)

    if (ship.thrusting) {

      const posX = (ship.x - ship.radius * 4 / 3 * Math.cos(ship.radian)) + Math.random()
      const posY = (ship.y + ship.radius * 4 / 3 * Math.sin(ship.radian)) + Math.random()
      const particleSize = Math.random() * (7 - (ship.thrust.x + ship.thrust.y) / 10)
      const particleAlpha = 0.4 * (Math.random() + 0.5)

      const direction = {
        x: posX - (ship.x) + Math.random() * 2,
        y: posY - (ship.y) + Math.random() * 2
      }

      for (let i = 0; i < 7; i++) {
        particles.push(new engineParticle(
          posX, posY, particleSize, deltaParticles.colors.main, direction,
          particleAlpha
        ))
      }
    }

    if (ship.decrease) {

      const posX = ship.x + ship.radius * 4 / 3 * Math.cos(ship.radian) * 1.2
      const posY = ship.y - ship.radius * 4 / 3 * Math.sin(ship.radian) * 1.2
      const particleSize = Math.random() * (3 - (ship.thrust.x + ship.thrust.y) / 10)
      const particleAlpha = 0.9 * (Math.random() + 0.5)

      const direction = {
        x: posX - (ship.x + ship.thrust.x) + Math.random() * 2,
        y: posY - (ship.y + ship.thrust.y) + Math.random() * 2
      }

      for (let i = 0; i < 5; i++) {

        particles.push(new engineParticle(
          posX, posY, particleSize, deltaParticles.colors.gases, direction, particleAlpha, 0.39
        ))
      }
    }

    if (ship.rotation != 0) {
      const offset = ship.rotation > 0 ? -80 : 80
      const posX = ship.x + 4 / 3 * (ship.radius * Math.cos(ship.radian + offset))
      const posY = ship.y - 4 / 3 * (ship.radius * Math.sin(ship.radian + offset))
      const particleSize = Math.random() * (3)
      const particleAlpha = 0.9 * (Math.random() + 0.5)

      const direction = {
        x: posX - (ship.x + ship.thrust.x) - Math.random(),
        y: posY - (ship.y + ship.thrust.y) - Math.random()
      }

      for (let i = 0; i < 5; i++) {

        particles.push(new engineParticle(
          posX, posY, particleSize, deltaParticles.colors.gases, direction, particleAlpha, 0.28
        ))
      }
    }
  }

  return {
    fps,
    playerShip,
    spaceShips,
    planets,
    particles,
    exportData
  }

}
