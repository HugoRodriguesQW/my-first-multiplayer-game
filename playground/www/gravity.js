export default function makeGravity(obj1, obj2) {
  

var newtonsLawOfUniversalGravitation = function (mass1, mass2, distance) {
 var force =  9.81 * ((mass1 * mass2) / Math.pow(distance, 2));
 var attraction2 = force / mass2;
 return attraction2;
};

var getDistance = function (x1, y1, x2, y2) {
 var a = Math.abs(x1 - x2);
 var b = Math.abs(y1 - y2);
 return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};

var getDirection = function (x1, y1, x2, y2, attraction) {
  var direction = Math.atan2(x1 - x2, y1 - y2);
  var attractionX = Math.sin(direction) * attraction;
  var attractionY = Math.cos(direction) * attraction;
  return {x: attractionX, y: attractionY, dir: direction}
  
}

var distance = getDistance(obj1.x,obj1.y, obj2.x, obj2.y)
var newtons = newtonsLawOfUniversalGravitation(obj1.mass, obj2.mass, distance)
var direction = getDirection(obj1.x,obj1.y, obj2.x, obj2.y, newtons)

return{
  direction,
  distance,
  newtons
}
}