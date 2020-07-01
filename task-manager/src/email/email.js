const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'meylismatiyev2@gmail.com',
        subject: 'Welcome!',
        text: `Hello ${name}. We are very glad to see you in our website!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'meylismatiyev2@gmail.com',
        subject: 'Good Bye!',
        text: `${name}, we hope to see you again very soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}