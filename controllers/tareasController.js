const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.agregarTarea = async (req, res, next) => {
    // Obtenemos el Proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } })


    // leer el valor input
    const { tarea } = req.body

    // estado 0 incompleto y ID de proyecto
    const estado = false
    const proyectoId = proyecto.id


    // Insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId })

    if (!resultado) { return next() }

    // redireccionar
    res.redirect(`/proyectos/${req.params.url}`)
}


exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params

    const tarea = await Tareas.findOne({ where: { id } })
    //cambiar el estado
    tarea.estado = !tarea.estado

    const resultado = await tarea.save()
    if (!resultado) return next();

    res.status(200).send('Actualizado')

}

exports.eliminarTarea = async (req, res, next) => {
    const { id } = req.params

    // eliminar tarea
    const resultado = await Tareas.destroy({ where: { id } })
    if (!resultado) {
        return next()
    }
    res.status(200).send('Tarea Eliminada...')
}