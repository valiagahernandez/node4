// Se encarga de hacer los distintos servicios de recetas

const express = require('express');
const multer = require('multer');

let Receta = require(__dirname + '/../models/receta.js');
let router = express.Router();
let autenticacion = require(__dirname + '/../utils/auth.js');


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })

let upload = multer({storage: storage});



// Servicio de listado general
router.get('/', autenticacion, (req, res) => {
    Receta.find().then(resultado => {
        res.render('admin_recetas', { recetas: resultado});
    }).catch (error => {
        res.render('admin_error');
    }); 
});

// Formulario de nueva receta
router.get('/recetas/nueva', autenticacion, (req, res) => {
    res.render('admin_recetas_form');
});

// Formulario para editar una receta
router.get('/recetas/editar/:id', autenticacion, (req, res) => {
    Receta.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_recetas_form', { receta: resultado});
        else    
            res.render('admin_error', {error: "Receta no encontrada"});
    }).catch (error => {
        res.render('admin_error');
    }); 
});

// Insertar receta
router.post('/recetas', autenticacion, upload.single('imagen'), (req, res) => {
    let elemento1;
    let elemento2;
    let elemento3;
    let elementosF=[];
    if(req.body.ingrediente1 && req.body.cantidad1 && req.body.unidad1){
        elemento1 = {
            ingrediente: req.body.ingrediente1,
            cantidad: req.body.cantidad1,
            unidad: req.body.unidad1
        };
        elementosF.push(elemento1);
    }
    if(req.body.ingrediente2 && req.body.cantidad2 && req.body.unidad2){
        elemento2 = {
            ingrediente: req.body.ingrediente2,
            cantidad: req.body.cantidad2,
            unidad: req.body.unidad2
        };
        elementosF.push(elemento2);
    }
    if(req.body.ingrediente3 && req.body.cantidad3 && req.body.unidad3){
        elemento3 = {
            ingrediente: req.body.ingrediente3,
            cantidad: req.body.cantidad3,
            unidad: req.body.unidad3
        };
        elementosF.push(elemento3);
    }
    
    let nuevaReceta = new Receta({
        titulo: req.body.titulo,
        comensales: req.body.comensales,
        preparacion: req.body.preparacion,
        coccion: req.body.coccion, 
        descripcion: req.body.descripcion, 
        imagen: req.file.filename,
        elementos: elementosF
    });
    nuevaReceta.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

// Modificar receta
router.put('/recetas/:id', autenticacion, upload.single('imagen'), (req, res) => {
    let elemento1;
    let elemento2;
    let elemento3;
    
    if(req.body.ingrediente1 && req.body.cantidad1 && req.body.unidad1){
        elemento1 = {
            ingrediente: req.body.ingrediente1,
            cantidad: req.body.cantidad1,
            unidad: req.body.unidad1
        };
        
    }
    if(req.body.ingrediente2 && req.body.cantidad2 && req.body.unidad2){
        elemento2 = {
            ingrediente: req.body.ingrediente2,
            cantidad: req.body.cantidad2,
            unidad: req.body.unidad2
        };
        
    }
    if(req.body.ingrediente3 && req.body.cantidad3 && req.body.unidad3){
        elemento3 = {
            ingrediente: req.body.ingrediente3,
            cantidad: req.body.cantidad3,
            unidad: req.body.unidad3
        };
        
    }
    let elementosF=[elemento1, elemento2, elemento3];
    let nuevaReceta = {
        titulo: req.body.titulo,
        comensales: req.body.comensales,
        preparacion: req.body.preparacion,
        coccion: req.body.coccion,
        descripcion: req.body.descripcion,
        elementos: elementosF
    };

    if(typeof req.file !== 'undefined'){
        nuevaReceta.imagen = req.file.filename;
    }

    Receta.findOneAndUpdate(req.params.id, {
        $set: nuevaReceta 
    }, {
        new: true
    }).then(resultado => {
        if (resultado)
            res.redirect(req.baseUrl);
        else
            res.render('admin_error', {
                error: 'Receta no encontrada'
            });
    }).catch(error => {
        res.render('admin_error')
    });
});

// Borrar receta
router.delete('/recetas/:id', (req,res) => {
    Receta.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});
module.exports = router;