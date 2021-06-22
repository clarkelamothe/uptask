const crypto = require('crypto')
const passport = require('passport')
const bcrypt = require('bcrypt')
const enviarEmail = require('../handler/email')

// const session = require('express-session')
const { Sequelize } = require('sequelize')
const Usuarios = require('../models/Usuarios')
const Op = Sequelize.op

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos son obligatorios'
});


// funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next()
    }


    // si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')

}


// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion') // redireccionar al home al cerrar sesion
    })
}


exports.enviarToken = async (req, res) => {

    const usuario = await Usuarios.findOne({ where: { email: req.body.email } })

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // // Save datas
    await usuario.save();

    // // URL reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar Correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}





exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token

        }
    })
    // si no encuentra el usuario

    if (!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }

    // formulario para generar password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}


// cambiar el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    // verifica el token valido y tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }

        }
    })

    // verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }

    // if (usuario.expiracion >= Date.now()) {
    // hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null

    // guardamos el nuevo password
    await usuario.save()
    // }

    req.flash('correcto', 'tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')
}



