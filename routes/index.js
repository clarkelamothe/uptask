const express = require('express')
const router = express.Router()

// importar express validator
const { body } = require('express-validator')


// importar el controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')

module.exports = function () {
    // ruta para el home
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome)

    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto)

    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto)

    // Listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl)


    // Actualizar proyecto
    router.get('/proyectos/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar)
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto)

    // Eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto)

    // Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea)

    // actualizar tareas
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea)

    // eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea)

    // Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)


    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)


    // cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)



    // reestablecer contrasena
    router.get('/reestablecer', usuariosController.formRestablecerPassword)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)



    return router
}

