const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCancelEmail = (email, name) => {
  // const msg = {
  //   to: "kennethjwong@yahoo.com",
  //   from: "kennethjwong@hotmail.com",
  //   subject: "this is my first creation",
  //   text: "I hope you get this message",
  //   html: "<strong>from Node.js</strong>",
  // };
  const msg = {
    to: email,
    from: "kennethjwong@hotmail.com",
    subject: "Sorry to see you go",
    text: `Hey ${name}.  It's not goodbye but a see you later, a'right?!`,
    // html: "<strong>from Node.js</strong>",
  };

  sgMail
    .send(msg)
    .then((res) => {
      console.log(res[0].statusCode);
      console.log(res[0].headers);
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendWelcomeEmail = (email, name) => {
  // const msg = {
  //   to: "kennethjwong@yahoo.com",
  //   from: "kennethjwong@hotmail.com",
  //   subject: "this is my first creation",
  //   text: "I hope you get this message",
  //   html: "<strong>from Node.js</strong>",
  // };
  const msg = {
    to: email,
    from: "kennethjwong@hotmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to the app, ${name}.  Let me know how you get along with the app`,
    // html: "<strong>from Node.js</strong>",
  };

  sgMail
    .send(msg)
    .then((res) => {
      console.log(res[0].statusCode);
      console.log(res[0].headers);
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  sendWelcomeEmail: sendWelcomeEmail,
  sendCancelEmail: sendCancelEmail,
};
