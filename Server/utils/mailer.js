const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:Number(process.env.EMAIL_PORT||587),
    secure:process.env.EMAIL_PORT === '465',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
async function sendMail({to,subject,html,text}){
    try {
        const info = await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
        return info;
    } catch (error) {
        console.error('Email sending error:', error.message);
        throw new Error('Failed to send email');
    }
}

module.exports = { sendMail };