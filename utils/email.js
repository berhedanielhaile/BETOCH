const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.user = user;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `<danny dannyyo`;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.RESEND_EMAIL_HOST || process.env.EMAIL_HOST || 'smtp.resend.com',
        port: Number(process.env.RESEND_EMAIL_PORT || process.env.EMAIL_PORT || 465),
        secure: this.port === 465,
        auth: {
          user: process.env.RESEND_EMAIL_USERNAME || process.env.EMAIL_USERNAME,
          pass: process.env.RESEND_API_KEY || process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(template, {
      user: this.user,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.user.email,
      html,
      text: htmlToText.toString(html),
    };
    await this.newTransporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to betoch where renting is simple');
  }
};
