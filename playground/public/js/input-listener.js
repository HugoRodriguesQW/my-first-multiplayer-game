export default function createInput () {

    const controller = {
        commands: {
        thrusting: false,
        decreasing: false,
        rotateLeft: false,
        rotateRight: false,
        moveLeft: false,
        moveRight: false,
        heavyEngine: false,

        },

        listen: function ({type, which}) {
            const isKeyDown = type === 'keydown'

            switch (which) {
            case 87: // W
                controller.commands.thrusting = isKeyDown
                break
            case 65: // A
                controller.commands.rotateLeft = isKeyDown
                break
            case 83: // S
                controller.commands.decreasing = isKeyDown
                break
            case 68: // D
                controller.commands.rotateRight = isKeyDown
                break

            case 81: // Q
                controller.commands.moveLeft = isKeyDown
                break
            case 69: // E
                controller.commands.moveRight = isKeyDown
                break
            case 16: // Shift
                controller.commands.heavyEngine = isKeyDown
                break
            }
        }
    }

    addEventListener('keydown', controller.listen)
    addEventListener('keyup', controller.listen)

    return controller.commands
}