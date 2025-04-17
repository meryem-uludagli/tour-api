const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// mail içeriğini tanımla
const mailOptions = {
  from: '"meryem uludagli" meryem00@gmail.com', // sender address
  to: options.email, // list of receivers
  subject: options.subject, // Subject line
  text: options.text, // plain text body
  html: options.html, // html body
};
const sendMail = () => {};
export default sendMail;
