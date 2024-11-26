const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    service:"gmail",
    secure: false,
    port: 587,
    auth:{
        user: "alejaandromoscosoguerrero@gmail.com",
        pass: "lbsyvlbbshwsders"
    },
    tls:{
        rejectUnauthorized: false,
    }
})

module.exports = transporter