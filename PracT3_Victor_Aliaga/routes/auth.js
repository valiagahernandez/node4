const express = require('express');

let Usuario = require(__dirname + '/../models/usuario.js');
let router = express.Router();
var CryptoJS = require("crypto-js");

// Renderiza vista del login
router.get('/login', (req, res) => {
    res.render('auth_login');
});

// Comprobará si son válidos los campos para logearse
router.post('/login', (req, res) => {    
    Usuario.find().then(usuarios => {
        let login = req.body.login;
        let password = req.body.password;

        let existeUsuario = usuarios.filter(usuario =>
            usuario.login == login && 
            CryptoJS.AES.decrypt(usuario.password.toString(), 'secret key 123').toString(CryptoJS.enc.Utf8) == password);

        if (existeUsuario.length > 0) {
            req.session.usuario = existeUsuario[0].login;
            res.redirect('/admin/');
        } else {
            res.render('auth_login',
                { error: "Usuario o contraseña incorrectos."}
            );
        }
    }).catch(error => {
        res.render('admin_error');
    });
});


// Destruirá la sesion del usuario actual y redirige
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
   

module.exports = router;