const { response, request } = require("express");

const Usuario = require("../models/usuario");
const { isValidObjectId } = require("mongoose");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

//Buscar usuarios
const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID = isValidObjectId( termino )

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            result: (usuario) ? [ usuario ] : []
        });
    }

    const regxt = new RegExp( termino, 'i');


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({
            $or: [{ nombre: regxt }, {correo: regxt }],
            $and: [{ estado: true }] }),
        Usuario.find({
            $or: [{ nombre: regxt }, {correo: regxt }],
            $and: [{ estado: true }] })
    ])

    res.json({
        total,
        result: usuarios
    });
}

//Buscar categorias
const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = isValidObjectId( termino )

    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            result: (categoria) ? [ categoria ] : []
        });
    }

    const regxt = new RegExp( termino, 'i');

    const [total, categoria] = await Promise.all([
        Categoria.countDocuments({nombre: regxt, estado: true }),
        Categoria.find( { nombre: regxt, estado: true })
    ])

    res.json({
        total,
        result: categoria
    });
}

//Buscar productos
const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = isValidObjectId( termino )

    if ( esMongoID ) {
        const producto = await Producto.findById( termino ).populate( 'categoria', 'nombre');
        return res.json({
            result: (producto) ? [ producto ] : []
        });
    }

    const regxt = new RegExp( termino, 'i');

    const [total, producto] = await Promise.all([
        Producto.countDocuments({nombre: regxt, estado: true }),
        Producto.find( { nombre: regxt, estado: true }).populate( 'categoria', 'nombre')
    ])

    res.json({
        total,
        result: producto
    });
}



const buscar = (req = request, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `${coleccion} no es una coleccion permitida. Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res)
            
           break;
            
        case 'productos':
            buscarProductos( termino, res)
                
                break;  
                
        case 'categorias':
            buscarCategorias( termino, res );

            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido implemetar esta busqueda'
            })
    }

}



module.exports = {
    buscar,
}