import nodemailer from "nodemailer";

const sendMail = async (email,content,subject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: `Task Scheduler <${process.env.SMTP_FRM}>`,
        to: email,
        subject:subject,
        html: content,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  export default sendMail