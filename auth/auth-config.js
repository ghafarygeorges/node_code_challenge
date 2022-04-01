// Config file to communicate between the .env file and the auth-services

exports.jwt = {
  secret: process.env.JWT_SECRET,
  expiresIn: "2h",
};

exports.sendgrid = {
  key: process.env.SENDGRID_KEY,
  sender: process.env.SENDER_EMAIL,
};
