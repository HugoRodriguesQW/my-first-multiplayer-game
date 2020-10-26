export default function createPlanets (ctx)
{
  class planet {
    constructor(x, y, radius, color){ 
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    }

    draw(){
      ctx.fillStyle = 'red' 
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
      ctx.fill()
    }
  }

  const planets = []

  function spawPlanets(quant, maxSize) {

   
    
    for(let i= 0; i < quant; i++){
      // Choose a radius
      const radius = Math.random() * maxSize + (maxSize/10)

      // Choose a position
      const randomize = {
        x: Math.random(),
        y: Math.random(),
      }

      const pos = {
        x: randomize.x < 0? randomize.x * 7000 + (radius * 2):  randomize.x * 7000 - (radius * 2),
        y:  randomize.y < 0? randomize.y * 7000 + (radius * 2):  randomize.y * 7000 - (radius * 2)
      }


      planets.push(new planet(
        pos.x,
        pos.y,
         radius,
         'red'
      ))
    }
  }
  return {planets, spawPlanets}
}