const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_KEY } = process.env;
sgMail.setApiKey(SENDGRID_KEY);

const sendEmail = async (data) => {
  const msg = {
    ...data,
    from: "galinasavchyn1@gmail.com",
  };
  await sgMail.send(msg);
  return true;
};

module.exports = sendEmail;
