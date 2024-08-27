//Importacion de terceros
const { Router } = require('express');
const { check } = require('express-validator');

//Mis importaciones
const { validarCampos } = require('../middlewares/validar_campos');
const { login, googleIdentity } = require('../controllers/auth');


//Creacion del Router
const router = Router();



//POST
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

//POST
router.post('/google',[
    check('idToken', 'El idToken es necesario').not().isEmpty(),
    validarCampos
], googleIdentity);



module.exports = router