const { Socket } = require("socket.io")

//borrar el socket = new Socket()

const socketController = ( socket = new Socket() ) => {

    // console.log('cliente conectado', socket.id)
    
}



module.exports = {
    socketController,
}