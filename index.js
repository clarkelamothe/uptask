const express = require('express')
const routes = require('./routes')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
require('dotenv').config({ path: 'variables.env' })


//helpers con algunas funciones
const helpers = require('./helpers')

PORT = process.env.PORT || 3000

// Crear la conexion a la base de datos
const db = require('./config/db')
// Importar modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')


// crear una app de express
const app = express()

// aarchivos estaticos
app.use(express.static('public'))

// habilitar Pug
app.set('view engine', 'pug')
// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))


app.use(express.urlencoded({ extended: true }));
app.use(express.json());





// agregar flash messages
app.use(flash())

app.use(cookieParser())

// nos permiten a navegar entre distintas paginas sin volver a autenticarse
app.use(session({
    secret: "supersercreto",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


// pasar vardump a la app
app.use((req, res, next) => {
    const fecha = new Date()
    // res.locals.year = fecha.getFullYear()
    res.locals.vardump = helpers.vardump
    res.locals.mensajes = req.flash()
    res.locals.usuario = { ...req.user } || null
    next()
})


app.use('/', routes())

//servidor y puertos
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000




app.listen(port, host, () => {
    console.log(`Servidor escuchando en: ${host}:${port}`);

    db.authenticate()
        .then(() => {
            console.log('Conectado a la base de datos.')
            db.sync(
                {
                    // force: true
                }
            )
        })
        .catch(error => console.log('Error al conectar a la base de datos: ' + error.message))
})



// require('./handler/email')