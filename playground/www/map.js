const prefixes = ['Moon of', 'Earth', 'Yela', 'Delamar', 'Old', 'Hurrance', 'Arch', 'York', 'Jhune', 'The', 'Boos', 'Horizon', 'New', 'Fars']
const sufixes = [' Babbage', ' Pars', ' Aesis', ' Carachi', ' Fark', ' Lorville', ' Lagos', ' Deli', ' Dhaka', ' Anvil', ' Mirage', ' Dongguan']

export default function createMap(size) {

  const mapSize = size || { width: 30000, height: 30000 }

  const planets = []
  const names = []

  class planet {
    constructor(x, y, radius, color, name) {
      this.name = name

      this.x = x
      this.y = y
      this.radius = radius
      this.color = color
      this.orbitRange = this.radius * 2.5
      this.mass = this.radius * 2
    }
  }

  function spawPlanets(quant, maxSize) {

    GenerateName(quant)

    for (let i = planets.length; planets.length < quant; i++) {


      const radius = (Math.random() + 0.5) * (maxSize / 2)
      const padding = 4 * radius

      const spawArea = {
        x: padding + (mapSize.width - (padding * 2)),
        y: padding + (mapSize.height - (padding * 2))
      }

      const position = {
        x: padding + (Math.random() * spawArea.x),
        y: padding + (Math.random() * spawArea.y)
      }

      if (planetsCollision(position, radius)) {
        spawPlanets(quant, maxSize)
        break
      }

      planets.push(new planet(
        position.x,
        position.y,
        radius,
        Math.random() * 360, names[i]
      ))
    }
  }

  function planetsCollision(pos, radius) {
    return planets.map((planet) => {
      const dist = Math.hypot(Math.sqrt((planet.x - pos.x) ** 2 + (planet.y - pos.y) ** 2))
      return dist < (radius * 2.5) + (planet.radius * 2.5)? true : false
    }).includes(true)
  }


  function GenerateName(count) {
    for (let i = names.length; i < count; i++) {
      let name = prefixes[Math.floor(Math.random() * prefixes.length)]
      name = name + sufixes[Math.floor(Math.random() * sufixes.length)]

      let nameExist = false

      planets.forEach((planet) => {
        if (planet.name == name) {
          nameExist = true
        }
      })

      if (nameExist) {
        GenerateName(planets)
        break
      }
      names.push(name)
    }
  }

  return { planets, spawPlanets, mapSize, GenerateName }
}
