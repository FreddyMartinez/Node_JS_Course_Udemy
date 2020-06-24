const sgMail = require("@sendgrid/mail");

const sendGridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "cfalsofredy@gmail.com",
    subject: "Welcome to Task Manager",
    text: `Hi ${name}! Thanks for joining in. We hope you enjoy using the app.`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "cfalsofredy@gmail.com",
    subject: "Farewell",
    text: `Bye ${name}! We are sorry to see you go, we hope to see you back sometime.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
