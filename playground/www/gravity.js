//Complete

export default function makeGravity(obj, planet) {



  function attraction(p1, p2) {

    // Distance to other body
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var d = Math.sqrt(dx ** 2 + dy ** 2); // Possibly correct

    // Force of attracrtion
    var f = 9.87 * (p1.mass * p2.mass) / (d ** 2); // Possibly Correct

    // Direction of force, If you read it hard enough you should be able to hear my screams of pain
    // Not sure if this is correct, most likely not.
    var theta = Math.atan2(dy, dx);
    var fx = Math.cos(theta) * f;
    var fy = Math.sin(theta) * f;

    p1.velocity.x += fx / p1.mass;
    p1.velocity.y += fy / p1.mass;
    p1.theta = theta
    p1.orbitHeight = d - p2.radius

  }
  attraction(obj, planet)
}
