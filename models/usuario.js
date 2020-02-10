// Define el esquema de usuario
const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true 
    }
    
});

let Usuario = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuario;