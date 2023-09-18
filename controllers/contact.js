const { transporter } = require("../config/nodemailer")

const sendEmail = async (req, res) => {
  const { name, email, message, phone } = req.body
  try {
    await transporter.sendMail({
      from: `${name}<${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Test de envio de Email`,
      html: `
      <div>
        <h2>Nombre: ${name}</h2> 
        <p>Mensaje: ${message}</p>
        <p>Telefono: ${phone}</p>
      </div>`,
    })
    res.status(200).json({ message: "Email enviado con éxito" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al enviar el email" })
  }
}
module.exports = { sendEmail }
