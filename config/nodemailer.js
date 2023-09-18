const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

transporter
  .verify()
  .then(() => {
    console.log("¡Ready for send emails!")
  })
  .catch((error) => {
    console.log("The sender emails doesn't available: ", error)
  })

module.exports = { transporter }
