const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();
//borrar el socket = new Socket()

const socketController = async( socket = new Socket(), io ) => {

    // console.log('cliente conectado', socket.id)
    //console.log(socket.handshake.headers['x-token']);    
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !usuario ) {
        return socket.disconnect();
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //conectar a la sala por id usuario
    socket.join( usuario.id );//global, socket.id, usuario.id


    //console.log('Se conecto', usuario.nombre);

    //limpiar cuando alguien se desconecta

    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if( uid ) {
            //mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    })
    
}



module.exports = {
    socketController,
}