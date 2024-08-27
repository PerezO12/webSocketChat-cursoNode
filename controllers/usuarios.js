const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { param } = require('express-validator');

// GET
const usuariosGet = async( req = request, res = response ) => {
    const { limite = 5, desde = 0 } = req.query;
    

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( {estado: true} ),
        Usuario.find( {estado: true} )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ])
    res.json({
        total,
        usuarios
    });
}

// PUT
const usuariosPut = async( req = request, res = response ) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json(usuario);
}

// POST
const usuariosPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

// DELETE
const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    
    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndUpdate( id );

    //borrar sin borrar x la integridad referncial
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });
    
    
    if (!usuario) {
        return res.status(401).json({
            msg: 'Usuario no encontrado'
        });
    }

    //mostrar el usuario autenticado
    const usuarioAutenticado = req.usuario
    res.json({
        msg: 'Usuario eliminado',
        usuario,
        usuarioAutenticado
    });
}

// PATCH
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}
