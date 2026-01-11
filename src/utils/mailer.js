const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing in .env");
  }

  return resend.emails.send({
    from: "DevTinder <onboarding@resend.dev>", 
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail };
