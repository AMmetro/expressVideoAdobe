const nodemailer = require("nodemailer");

export type emailInfoType = {
  email: string,
  subject: string,
  code: string,
  }
  
  export type emailDebugType = emailInfoType & {debug?: any}

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


export const emailAdaper = {

  async sendEmailRecoveryMessage(emailInfo: emailInfoType) {
   const mailLayout = HTML_TEMPLATE_CONFIRMATION(emailInfo);
    try {
       const info = await transporter.sendMail({
        from: "nodeMailer <nodemailerstud@gmail.com>", // sender address
        to: emailInfo.email, // list of receivers
        subject: emailInfo.subject,
        // text: "plain text body", // - for old version supported only
        html: mailLayout,
      });
      console.log("Message sent: %s", info);
    } catch (e) {
      console.log(e);
    }
  },

  async sendRecoveryCode(emailInfo: emailInfoType) {
   const mailLayout = HTML_TEMPLATE_RECOVERY(emailInfo);
    try {
       const info = await transporter.sendMail({
        from: "nodeMailer <nodemailerstud@gmail.com>",
        to: emailInfo.email,
        subject: emailInfo.subject,
        html: mailLayout,
      });
      console.log("Message sent: %s", info);
    } catch (e) {
      console.log(e);
    }
  },



  async sendEmailDebug(emailInfo: emailDebugType) {
   const mailLayout = HTML_TEMPLATE_DEBUG(emailInfo);
    try {
      const info = await transporter.sendMail({
        from: "nodeMailer <nodemailerstud@gmail.com>", // sender address
        to: emailInfo.email, // list of receivers
        subject: emailInfo.subject,
        // text: "plain text body", // - for old version supported only
        html: mailLayout,
      });
      console.log("Message sent: %s", info);
    } catch (e) {
      console.log(e);
    }
  },

};

const HTML_TEMPLATE_CONFIRMATION = (emailInfo: emailInfoType) => {
  const confirmationCode = emailInfo.code
  return `
  <h1>Thank for your registration</h1>
  <p>To finish registration please follow the link below:
      <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
  </p>
  `;
}

const HTML_TEMPLATE_RECOVERY = (emailInfo: emailInfoType) => {
  const recoveryCode = emailInfo.code
  return `
  <h1>Password recovry</h1>
  <p>To finish password recovery please follow the link below:
   <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
</p>
  `;
}



const HTML_TEMPLATE_DEBUG = (emailInfo: emailDebugType) => {
  const confirmationCode = emailInfo.code
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
            <a href='https://express-video-adobe.vercel.app/auth/registration-confirmation?code=${confirmationCode}'>complete registration</a>
        </p> 
        <span>  
        <pre>${emailInfo.debug}</pre>
        </span>  
        </div>
      </body>
    </html>
  `;
}

