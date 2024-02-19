export type emailInfoType = {
email: string,
subject: string,
confirmationCode: string,
}

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nodeMailerStud@gmail.com",
    pass: "uobl xxkm ecwp ygek",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const emailAdaper = {
  async sendEmailRecoveryMessage(emailInfo: emailInfoType) {
    // const mailLayout = `<b>${emailInfo.message}</b>`;

   const mailLayout = HTML_TEMPLATE(emailInfo);
    try {
      const info = await transporter.sendMail({
        from: "nodeMailer <nodemailerstud@gmail.com>", // sender address
        to: emailInfo.email, // list of receivers
        subject: emailInfo.subject,
        // text: "plain text body", // - for old version supported only
        html: mailLayout,
      });
      // console.log("Message sent: %s", info.to);
    } catch (e) {
      console.log(e);
    }
  },

};

const HTML_TEMPLATE = (emailInfo: any) => {
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
            <a href='https://express-video-adobe.vercel.app/auth/registration-confirmation?code=${emailInfo.confirmationCode}'>complete registration</a>
        </p> 
        <span>  
        <pre>${emailInfo.debug}</pre>
        </span>  
        </div>
      </body>
    </html>
  `;
}

            // <a href='https://www.kvaza.com/phpinfo.php'>complete registration</a>