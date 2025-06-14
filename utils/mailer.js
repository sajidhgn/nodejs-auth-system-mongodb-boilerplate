const nodemailer = require('nodemailer');

async function sendEmail(email, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.AUTH_HOST,
      port: parseInt(process.env.AUTH_EMAIL_PORT, 10), // Ensure port is a number
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
      },
      // tls: {
      //   ciphers: "SSLv3", // Ensure compatibility
      // },
      connectionTimeout: 10000, // Timeout in 10 seconds
    });

    const mailOptions = {
      from: '"OxCody ⚡︎⚡︎⚡︎" <sajidhgn1@gmail.com>',
      to: email,
      subject: subject || "OxCody ✔",
      text: message,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
        return { msg: info.response };
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
}

module.exports = { sendEmail };