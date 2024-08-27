const { response, request } = require("express");
const { Producto, Categoria} = require("../models/");



//obtener producto - paginado - total - populate
const obtenerProductos = async (req = request, res = response ) => {
    const { limite = 10, desde = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments( {estado: true} ),
        Producto.find( {estado: true} )
            .populate( 'usuario', 'correo' )
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ])


    res.json({
        total,
        productos
    });
}
//obtener producto - populate{}
const obtenerProductoID = async (req = request, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findById( id )
                .populate( 'usuario', 'correo' )
                .populate( 'categoria', 'correo' );


    res.json({
        producto
    })
}

const crearProducto = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();
    const nombreCategoria = req.body.categoria.toUpperCase();
    const { precio, descripcion } = req.body;

    const [productoDB, categoria] = await Promise.all([
        Producto.findOne( {nombre} ),
        Categoria.findOne( {nombre: nombreCategoria} )
    ])

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        categoria: categoria._id,
        descripcion,
        nombre,
        precio,
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    //Guardar en DB
    await producto.save();
    

    res.status(201).json(producto)

}


//actualizar Producto put
const actualizarProducto = async( req = request, res = response ) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    data.categoria = await Categoria.findOne( {nombre: data.categoria})._id


    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });


    res.json({
        producto
    })

 }

//borrarCategoria - estado: false

const borrarProducto = async( req = request, res = response ) => {
    
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });



    res.json({
        producto
    })

 }


module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProductoID,
}