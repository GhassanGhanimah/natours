/*eslint-disable*/
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.form = `ghassan ghainmah  <${process.env.EMAIL_FORM}>`;
  }
  newcreateTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstname,
        url: this.url,
        subject
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      html,
      subject,
      text: htmlToText.fromString(html)
      // html:
    };

    await this.newcreateTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('Welcome', 'Welcome  to the natours family ');
  }
  async sendPassowrdReset() {
    await this.send(
      'passwordReset',
      'your password reset token (valid for only 10 min '
    );
  }
};
