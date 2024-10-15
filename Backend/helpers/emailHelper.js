const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Failed to send OTP email', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (err) {
    console.log('Server error:', err);
  }
};


const sendQueryMessage = async (name, email, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Contact Query from ${name}`,
    text: `You have received a new query from ${name} (${email}):\n\n${message}`,
  };

  return transporter.sendMail(mailOptions);
};


module.exports = {
  sendOtpEmail,
  sendQueryMessage
};