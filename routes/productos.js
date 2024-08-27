//Importacion de terceros
const { Router } = require('express');
const { check } = require('express-validator');

//Mis importaciones
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');
const { obtenerProductoID, obtenerProductos, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaNombre, existeProductoPorId } = require('../helpers/db-validators');


//Creacion del Router
const router = Router();

//GET
//Obtener todas las productos - publico
router.get('/', obtenerProductos)

//GET
//Obtener una producto por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProductoID)


//POST
//Crear producto - privado- cualquier usuario con token valido
router.post('/',[
    validarJWT,
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaNombre ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto)

//PUT
//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('categoria').custom( existeCategoriaNombre ),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto)

//DELETE
//Borrar producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
    ], borrarProducto)



module.exports = router