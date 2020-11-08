export default function inputListener(document) {

  // CONTROLLER AND SHIP MOVE
  const controller = {
    increaseSpeed: false,
    decreaseSpeed: false,
    rotateLeft: false,
    rotateRight: false,

    listen: function(command) {
      let isPressed = command.type === 'keydown' ? true : false

      switch (command.keyCode) {
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

  return controller

}
