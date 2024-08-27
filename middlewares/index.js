

const validarCampos  = require('../middlewares/validar_campos');
const validarJWT  = require('../middlewares/validar-jwt');
const validaRole = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo') 

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRole,
    ...validarArchivo
}