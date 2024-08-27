//Importacion de terceros
const { Router } = require('express');
const { check } = require('express-validator');

//Mis importaciones
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenClaudinary, mostrarImagenClaudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


//Creacion del Router
const router = Router();

//POST
router.post('/', validarArchivoSubir,cargarArchivo);

//PUT
router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenClaudinary )
//], actualizarImagen )

//GET
router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagenClaudinary  )

module.exports = router