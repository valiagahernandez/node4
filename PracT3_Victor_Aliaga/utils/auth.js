// middleware de autenticación que verificará si existe un usuario almacenado en sesión antes de dejar pasar

let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.redirect('/auth/login');
};
module.exports = autenticacion;