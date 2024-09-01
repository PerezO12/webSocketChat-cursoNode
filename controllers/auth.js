const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario no activo'
            });
        }

        // Verificar password
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JSON Web Token
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Habla con el administrador'
        });
    }
}

const googleIdentity = async (req = request, res = response) => {
    const { idToken } = req.body;

    try {
        // Verificar el token de Google y extraer datos
        const { correo, nombre, img } = await googleVerify(idToken);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':D',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB está inactivo

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);


        // Enviar respuesta exitosa
        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: 'Token de Google no válido'
        });
    }
}

const validarTokenController = async( req, res = response) => {

    const { usuario } = req;

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleIdentity,
    validarTokenController
}