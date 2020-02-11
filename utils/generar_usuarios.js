// Usuarios previamente almacenados 
// y que la aplicación no tenga que ocuparse de registrar usuarios

const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
var CryptoJS = require("crypto-js");

mongoose.connect('mongodb://ibai.site:27020/recetasV3');

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'nacho',
    password: CryptoJS.AES.encrypt('12345678', 'secret key 123')
});
usu1.save();

let usu2 = new Usuario({
    login: 'arturo',
    password: CryptoJS.AES.encrypt('12345678', 'secret key 123')
});
usu2.save();