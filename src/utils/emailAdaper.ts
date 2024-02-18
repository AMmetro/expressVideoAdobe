// import { nodemailer } from "nodemailer"
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nodeMailerStud@gmail.com",
    pass: "nju2!56Dkyku",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const emailAdaper = {
  async sendEmailRecoveryMessage(emailInfo: any) {
    // const mailLayout = `<b>${emailInfo.message}</b>`;
    const mailLayout = HTML_TEMPLATE(emailInfo.confirmationCode);
    try {
      const info = await transporter.sendMail({
        from: "Dimych <DimychDeveloper@example.com>", // sender address
        to: "resiver@example.com", // list of receivers
        subject: emailInfo.subject,
        // text: "Hello world?", // plain text body - for old version supported only
        html: mailLayout,
      });
      console.log("Message sent: %s", info.messageId);
    } catch (e) {
      console.log(e);
    }
  },

};

const HTML_TEMPLATE = (confirmationCode: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
      </head>
      <body>
        <div class="container">
        <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>   
        </div>
      </body>
    </html>
  `;
}
