// Beautiful, no dependencies

export default function createMap() {

  const mapSize = {
    width: 30000,
    height: 30000
  }


  class planet {
    constructor(x, y, radius, color) {
      this.x = x
      this.y = y
      this.radius = radius
      this.color = color

      this.orbitRange = this.radius * 2.5
      this.mass = this.radius * 2
    }

    draw() {

    }
  }

  const planets = []

  function spawPlanets(quant, maxSize) {
    console.log('MAP: planets spawner required...')

    for (planets.length; planets.length < quant;) {
      // Choose a radius
      const radius = (Math.random() + 0.5) * (maxSize / 2)
      const padding = 4 * radius

      const spawArea = {
        x: padding + (mapSize.width - (padding * 2)),
        y: padding + (mapSize.height - (padding * 2))
      }

      // Choose a position
      const randomize = {
        x: Math.random(),
        y: Math.random(),
      }

      let pos = { x: 0, y: 0 }

      const position = {
        x: padding + (Math.random() * spawArea.x),
        y: padding + (Math.random() * spawArea.y)
      }

      if (!planetsCollision(position, radius)) {
        pos = position
        console.log('MAP: Planet spawned at:')
        console.log('MAP (Planet U-Position): ', 'x: ' + Math.round(pos.x), 'y: ' + Math.round(pos.y))
      }
      else {
        console.log('MAP: Unable to generate. Trying again...')
        spawPlanets(quant, maxSize)
        break
      }

      planets.push(new planet(
        pos.x,
        pos.y,
        radius,
        Math.random() * 360
      ))
    }

  }


  function planetsCollision(pos, radius) {
    let collision = false

    planets.forEach((planet) => {
      const dist = Math.hypot(Math.sqrt((planet.x - pos.x) ** 2 + (planet.y - pos.y) ** 2))
      if (dist < (radius * 2.5) + (planet.radius * 2.5)) {
        collision = true
      }
    })
    return collision
  }

  return { planets, spawPlanets, mapSize }
}
