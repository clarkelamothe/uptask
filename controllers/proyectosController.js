const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')



exports.proyectosHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({ where: { usuarioId } })

    res.render('index', {
        nombrePagina: 'Proyectos ',
        proyectos
    })
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({ where: { usuarioId } })
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos,
        usuarioId
    })
}

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({ where: { usuarioId } })
    // const proyectos = await Proyectos.findAll()
    // Enviar a la consolo lo que el usuario escriba
    // console.log(req.body);

    // validar que el input no sea vacia
    const { nombre } = req.body
    let errores = []

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    }

    // si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD
        const usuarioId = res.locals.usuario.id
        await Proyectos.create({ nombre, usuarioId })
        res.redirect('/')
    }
}


exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } })

    // const proyectosPromise = Proyectos.findAll()
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])
    // consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
        // ,
        // include: [
        //     { model: Proyectos }
        // ]
    })
    console.log(tareas);
    if (!proyecto) return next()

    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = await Proyectos.findAll({ where: { usuarioId } })

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])


    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyecto,
        proyectos
    })
}


exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({ where: { usuarioId } })
    // Enviar a la consolo lo que el usuario escriba
    // console.log(req.body);

    // validar que el input no sea vacia
    const { nombre } = req.body
    let errores = []

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    }

    // si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD

        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        )
        res.redirect('/')
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    const { urlProyecto } = req.query
    const respuesta = await Proyectos.destroy({ where: { url: urlProyecto } })
    if (!respuesta) {
        return next()
    }
    res.status(200).send('Proyecto Eliminado Correctamente')
}