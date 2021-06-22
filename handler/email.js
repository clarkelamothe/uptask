const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')

const emailConfig = require('../config/email')


const transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

// generar HTML

const generarHtml = (archivo, opciones = {}) => {
    res.send('ajldfjaldjflkajdfkklsj')
    const html = pug.renderFile(
        `${__dirname}/../views/emails/${archivo}.pug`
        , opciones)
    return juice(html)
}

exports.enviar = async (res, opciones) => {
    res.send(opciones);
    try {
        const html = generarHtml(opciones.archivo, opciones)
        // const text = htmlToText.fromString()
        const text = htmlToText(html)
        let opcionesEmail = {
            from: "UpTask <no-reply@uptask.com>",
            to: opciones.usuario.email,
            subject: opciones.subject,
            text: text,
            html: html
        };
        // await transport.sendMail(info)
        // send mail with defined transport object
        const enviarEmail = util.promisify(transport.sendMail, transport)
        return enviarEmail.call(transport, opcionesEmail)
    } catch (error) {
        console.log(error);
    }

    // transport.sendMail(opcionesEmail)
}




