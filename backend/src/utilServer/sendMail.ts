
import nodemailer from 'nodemailer'
import { getSettingDB } from './prismaCRUD/settingDB';

// const sendGridTransport = require('nodemailer-sendgrid-transport');
// const appName = require('./appName');
// const { pureBaseUrl } = require('../utils/baseUrl');

// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey('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')

// const options = {
//     auth: { api_key: process.env.SENDGRID_API }
// }

// const transporter = nodemailer.createTransport(sendGridTransport(options));
// const transporter = () => nodemailer.createTransport({
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });


// const sendMail = async (userEmail, subject, text, html) => {

//   const msg = {
//     to: userEmail,
//     from: `${appName} <${process.env.EMAIL_FROM}>`,
//     subject,
//     text,
//     html
//   }

//   // try {
//   // const res = await
//   transporter()
//     .sendMail(msg)
//     .then(() => {
//       console.log('Email sent')
//       return true
//     })
//     .catch((error) => {
//       console.error(error)
//       return false
//     })


//   //   if (res.code > 400) {
//   //     throw res
//   //   }
//   //   return true
//   // } catch (error) {
//   //   console.log(error.message)
//   //   return false
//   // }


// }

// const msg = (userEmail: string, subject: string, text: string, html: any) => ({
//     to: userEmail,
//     from: { name: `${appName}`, email: process.env.EMAIL_FROM },
//     subject,
//     text,
//     html,
// })



// export const sendResetPasswordMail = (name: string, userEmail: string, resetToken: string) => {

//     const subject = `${appName} reset your password `;
//     const text = `Password reset token link is given below /n ${pureBaseUrl}/reset/${resetToken}`;

//     const html = ` <h2> Hey, ${name.split(' ')[0]} </h2>
//   <h4> Password reset token link is given below </h4>
//     <a style={text-decoration:'none}> ${pureBaseUrl}/reset/${resetToken} </a>
//     <p> This token is valid for 30 minutes</p>
//     <p> Ignore the email if you have not requested for the reset password </p>
//     `;

//     // return await sendMail(userEmail, subject, text, html);


//     sgMail
//         .send(msg(userEmail, subject, text, html))
//         .then(() => {
//             console.log('Email sent')
//             return true
//         })
//         .catch((error: any) => {
//             console.error(error.message)
//             return false
//         })
// };

//------------------------------------------------------------------

export async function transport() {

    const setting = await getSettingDB()

    if (setting['email_type'] == "smtp") {
        let params = {
            host: setting['email_smtp_host'],
            port: setting['email_smtp_port'],
            secure: true,
            auth: {
                user: setting['email_smtp_username'],
                pass: setting['email_smtp_password']
            },
            tls: {
                rejectUnauthorized: false
            }
        }

        //@ts-ignore
        return nodemailer.createTransport(params)
    }

    else if (setting['email_type'] == "gmail") {
        return nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: setting['email_smtp_username'],
                pass: setting['email_smtp_password']
            }
        });
    }


    else if (setting['email_type'] == "sendgrid") {
        return nodemailer.createTransport({
            //@ts-ignore
            host: 'smtp.sendgrid.net',
            port: 465,
            secure: true,
            auth: {
                user: "apikey",
                pass: setting['sendgrid_password']
            }
        });
    }


    else {
        return false
    }
}



export async function sendMail(email: string, subject: string, body: any) {
    const sendMailfunc = await transport();

    if (!!sendMailfunc) {
        sendMailfunc.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: subject,
            html: body
        }).catch((err: any) => {
            throw err;
        });
    }
}