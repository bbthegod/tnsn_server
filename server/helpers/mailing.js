const nodemailer = require('nodemailer');
const emailExistence = require('email-existence');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'nguyenthanhtung13399@gmail.com', // generated ethereal user
    pass: 'Pp2517339', // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendMail(receivers, code) {
  await emailExistence.check(receivers, function(err, res) {
    if (res) return;
  });
  transporter.sendMail(
    {
      from: 'HIT Club HaUI <nguyenthanhtung13399@gmail.com>',
      to: `${receivers}`, // list of receivers
      subject: 'Activation Code', // Subject line
      html: `
      <div
      style="
        width: 500px;
        border-top: orange 5px solid;
        background: #fafafa;
        font-family: 'Monstserat', sans-serif;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        text-align: center;
      "
    >
      <div style="width: 100%; padding-top: 50px;">
        <img
          src="https://i.ibb.co/f8cZym5/care-eye-roll-emoji-facebook.png"
          style="width: 300px; display: block; margin: auto;"
        />
      </div>
      <h1
        style="
          color: #000000;
          font-size: 28px;
          font-weight: 500;
          line-height: 36px;
          text-align: center;
          padding: 0;
          margin: 10px 0;
        "
      >
        Welcome to <span style="color:orange;">HIT CLUB</span> 
      </h1>
      <h3
        style="
          color: #999999;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          padding: 0;
          margin: 5px 0 20px 0;
        "
      >
        Unlock your account with this code below
      </h3>
      <p
        style="
          margin: 0px;
          background: orange;
          padding: 20px;
          color: white;
          font-size: 20px;
        "
      >
        ${code}
      </p>
    </div>`,
    },
    (error, info) => {
      if (error) {
        return console.log(error.message);
      }
    },
  );
}

module.exports = { sendMail };
