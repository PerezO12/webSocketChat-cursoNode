const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

/* 
ROLE
 */
const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });

    if(!existeRol) {
        throw new Error(`El rol ${ rol } no esta registrado en la BD`)
    }
}

/* 
EMAIL
 */
const emailExiste = async( correo = '' ) => {

    //verificar si el correo existe

    const existeEmail = await Usuario.findOne({ correo });

    if ( existeEmail ) {
        throw new Error(`El correo: ${correo}, ya esta registrado`);
    }
}

/*
 USUARIOS 
 */
const existeUsuarioPorId = async( id ) => {
    //verificar si el id existe

    const existeID = await Usuario.findById( id );

    if ( !existeID ) {
        throw new Error(`El id ${id} no existe`);
    } 
}

/* 
PRODUCTOS
*/
const existeProductoPorId = async( id ) => {

    const existeID = await Producto.findById( id );

    if ( !existeID ) {
        throw new Error(`El id ${id} no existe`);
    } 
}

/* 
CATEGORIAS 
*/
const existeCategoriaNombre = async( nombre ) => {
    nombre = nombre.toUpperCase()
    const categoriaDB = await Categoria.findOne( {nombre} )

    if (!categoriaDB) {
        throw new Error(`La categoria ${nombre} no existe`)
    }
}
const existeCategoriaPorId = async( id ) => {

    const existeID = await Categoria.findById( id );

    if ( !existeID ) {
        throw new Error(`El id ${id} no existe`);
    } 
}

/* 
Validar colecciones permitidas
*/

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );

    if ( !incluida ) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }
    
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeCategoriaNombre,
    existeProductoPorId,
    coleccionesPermitidas,
    
}
