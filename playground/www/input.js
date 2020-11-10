export default function makeInputListener(document) {

  const controller = {
    types: ['key', 'mouse'],
    increaseSpeed: false,
    decreaseSpeed: false,
    rotateLeft: false,
    rotateRight: false,
    shooting: { is: false, dir: { x: 0, y: 0 } },

    listen: function(command) {

      const isPressed = function() {
        for (const i in controller.types) {
          const selected = `${controller.types[i]}down`
          if (selected === command.type) {
            return true
          }
        }
        return false
      }()

      switch (command.which) {
        case 1:
          controller.shooting.is = isPressed
          controller.shooting.dir = { x: command.clientX, y: command.clientX }
          break
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
  document.addEventListener('mousedown', controller.listen)
  document.addEventListener('mouseup', controller.listen)

  return controller
}
