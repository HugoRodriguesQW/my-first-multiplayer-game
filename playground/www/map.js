// Complete

export default function createMap() {
  // Import game map
  const mapSize = {
    width: 10000,
    height: 10000
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



    for (let i = 0; i < quant; i++) {
      // Choose a radius
      const radius = (Math.random() + 0.5) * maxSize
      const padding = 4 * radius
      const spawArea = {
        x: padding + (mapSize.width - (padding * 4)),
        y: padding + (mapSize.height - (padding * 4))
      }

      // Choose a position
      const randomize = {
        x: Math.random(),
        y: Math.random(),
      }

      const pos = {
        x: padding + (Math.random() * spawArea.x),
        y: padding + (Math.random() * spawArea.y)
      }

      console.log('Planet U-Position: ', 'x: ' + Math.round(pos.x), 'y: ' + Math.round(pos.y))

      planets.push(new planet(
        pos.x,
        pos.y,
        radius,
        Math.random() * 360
      ))
    }
  }
  return { planets, spawPlanets, mapSize }
}
