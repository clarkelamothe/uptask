const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios')


// Local strategy login con credenciales propios - Usuario y password
passport.use(
    new LocalStrategy(
        // por default passport espera un user y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { email }
                })
                // el usuario existe pero el pass no
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: "Password Incorrecto"
                    })
                }
                //El email existe y password incorrecto
                return done(null, usuario)
            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: "Esa cuenta no existe"
                })
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
})

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
})

module.exports = passport