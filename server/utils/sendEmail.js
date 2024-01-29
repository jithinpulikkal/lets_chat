import nodemailer from 'nodemailer'

export const sendEmail = async (email, subject, text) => {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
                },
            }
        )
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("Email sent!");

    } catch (error) {
        console.log("Email failed!");
        console.log(error);
    }
}