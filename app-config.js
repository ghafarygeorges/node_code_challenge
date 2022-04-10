exports.jwt = {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: "15m",
};

exports.sendgrid = {
  key: process.env.SENDGRID_KEY,
  sender: process.env.SENDER_EMAIL,
};

exports.server = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
};
