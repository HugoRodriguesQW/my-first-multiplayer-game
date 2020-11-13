export default function makeGravity(corp, planet) {



  function attraction(obj, fixed) {

    var dx = fixed.x - obj.x;
    var dy = fixed.y - obj.y;
    var d = Math.sqrt(dx ** 2 + dy ** 2);

    var f = 9.87 * (obj.mass * fixed.mass) / (d ** 2);

    var theta = Math.atan2(dy, dx);
    var fx = Math.cos(theta) * f;
    var fy = Math.sin(theta) * f;

    obj.velocity.x += fx / obj.mass;
    obj.velocity.y += fy / obj.mass;
    obj.theta = theta
    obj.orbitHeight = d - fixed.radius

  }
  attraction(corp, planet)
}
