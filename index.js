// Establece los enrutadores, los middleware, la base de datos, la conexion... 

// Carga de librerías
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const session = require('express-session');

// Enrutadores
const recetas = require(__dirname + '/routes/recetas');
const auth = require(__dirname + '/routes/auth');
const publico = require(__dirname + '/routes/publico');

// Conectar con BD en Mongo 
mongoose.connect('mongodb://localhost:27020/recetasV3', { useNewUrlParser: true, useUnifiedTopology: true });

// Inicializar Express
let app = express();

// Iniciar sesiones
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

// asociacion de sesiones y recursos
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use(methodOverride('_method'));
// Cargamos ahora también la carpeta "public" para el CSS propio
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/admin', recetas);
app.use('/auth', auth);
app.use('/', publico);

// Puesta en marcha del servidor
app.listen(8090);