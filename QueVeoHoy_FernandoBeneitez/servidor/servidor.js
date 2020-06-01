let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let controller = require('./controladores/controller');

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/peliculas',controller.buscarPelis);
app.get('/generos',controller.buscarGeneros);
app.get('/peliculas/recomendacion',controller.recomendacion);
app.get('/peliculas/:id',controller.obtenerPeli);

let puerto = '8080';

app.listen(puerto, () => console.log( "Escuchando en el puerto " + puerto));