const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socketController');


class Server{

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer(this.app)
        this.io     = require('socket.io')(this.server);

        this.paths = {
            auth : '/api/auth',
            buscar : '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',
        }
        
        //Conectar a base de datos
        this.conectarDB();
        //middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();

        //Sickets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares(){
        //cors (seguridad)
        this.app.use( cors() );

        //lectura y pareseo del body
        this.app.use( express.json() );

        //directorio publico
        this.app.use(express.static('public'));

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }
    
    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io));
    }

    listen(){
        this.server.listen( this.port, () =>{
            console.log( `Servidor corriendo en el puerto ${this.port}` );
        });
    }
}




module.exports = Server;