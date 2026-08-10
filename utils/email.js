const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, message) {
    this.to = user.email;
    this.name = user.name;
    this.message = message;
  }

  newTransporter() {
    if (process.env.EMAIL_SERVICE === 'gmail' || process.env.EMAIL_HOST === 'smtp.gmail.com') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || process.env.EMAIL_USERNAME,
          pass: process.env.GMAIL_PASS || process.env.EMAIL_PASSWORD,
        },
      });
    }

    const host = process.env.RESEND_EMAIL_HOST || process.env.EMAIL_HOST || 'smtp.resend.com';
    const port = Number(process.env.RESEND_EMAIL_PORT || process.env.EMAIL_PORT || 465);
    const secure = port === 465;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.RESEND_EMAIL_USERNAME || process.env.EMAIL_USERNAME,
        pass: process.env.RESEND_API_KEY || process.env.EMAIL_PASSWORD,
      },
    });
  }

  mailOptions() {
    return {
      from: process.env.EMAIL_FROM || `Betoch <${process.env.GMAIL_USER || process.env.EMAIL_USERNAME}>`,
      to: this.to,
      subject: 'Reset your password',
      text: this.message,
    };
  }

  async sendEmail() {
    const transporter = this.newTransporter();
    return await transporter.sendMail(this.mailOptions());
  }
};
