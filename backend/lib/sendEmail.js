import nodemailer from 'nodemailer';

export const sendEmail = async(options) => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    logger: process.env.NODE_ENV === "development",
    debug: process.env.NODE_ENV === "development"
  })

  const mailOptions = {
    from: `Sangam ${process.env.EMAIL_FROM}`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    throw new Error("Failed to send email: " + error.message);
  }
}