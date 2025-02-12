const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    service:"gmail",
    secure: false,
    port: 587,
    auth:{
        user: "YourEmail",
        pass: "YourPass"
    },
    tls:{
        rejectUnauthorized: false,
    }
})

module.exports = transporter