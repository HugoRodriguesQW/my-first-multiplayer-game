export default function createMap (ctx, mapSize)
{
  class planet {
    constructor(x, y, radius, color){ 
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    this.orbitRange = this.radius * 1.8
    this.mass = 700000,
    this.force = 0,
    this.velocity = {x: 0, y: 0}
    }

    draw()
    {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.fill();
      ctx.beginPath()
      ctx.arc(this.x, this.y, 20, 0, Math.PI*2, false)

      var  grd = ctx.createRadialGradient(
      this.x, this.y, this.radius / 4, this.x,this.y, this.radius * 1.6);
      grd.addColorStop(0, `hsla(${this.color}, 100%, 65%, 1)`);
      grd.addColorStop(1,`hsla(${this.color}, 100%, 37%, 0.01)`);

      ctx.fillStyle = grd
      ctx.arc(this.x, this.y, this.radius * 1.6, 0, Math.PI*2, false)
      ctx.fill();

      //draw a planet
      ctx.beginPath()
      grd = ctx.createRadialGradient(
      this.x * 0.77, this.y * 0.75, this.radius / 2, this.x * 0.75,this.y * 0.75, this.radius * 1.75);
      grd.addColorStop(0, `hsla(${this.color}, 100%, 20%,1)`);
      grd.addColorStop(1,`hsla(${this.color}, 100%, 37%, 1)`);

      ctx.fillStyle = grd
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
      ctx.fill()
    }
  }
 
  const planets = []

  function spawPlanets(quant, maxSize) {

   
    
    for(let i= 0; i < quant; i++){
      // Choose a radius
      const radius = (Math.random() + 0.5) * maxSize
      const padding =  4 * radius
      const spawArea = {
        x: mapSize.width / padding,
        y: mapSize.height / padding
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

      console.log('planet: ', 'x: ' + Math.round(pos.x), 'y: '+ Math.round(pos.y))
      
      planets.push(new planet(
      1000,
       1000,
         radius,
         Math.random() * 360
      ))
    }
  }
  return {planets, spawPlanets}
}