//Importacion de terceros
const { Router } = require('express');
const { check } = require('express-validator');

//Mis importaciones
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');
const { crearCategoria, categoriaGet, categoriaGetID, categoriaPut, categoriaDelete } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

//Creacion del Router
const router = Router();

//GET
//Obtener todas las categorias - publico
router.get('/', categoriaGet)

//GET
//Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], categoriaGetID)


//POST
//Crear categoria - privado- cualquier usuario con token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//PUT
//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriaPut)

//DELETE
//Borrar categoria - Admin
router.delete('/:id',[
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeCategoriaPorId ),
        validarCampos
    ], categoriaDelete)



module.exports = router