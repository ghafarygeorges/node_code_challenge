// Third Party Packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

// Imported files
const User = require("./user-model");
const config = require("./auth-config");

sgMail.setApiKey(config.sendgrid.key);

exports.signup = async (body) => {
  const { email, name, password } = body;
  // find if user with email exists already. If true, throw error
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    const error = new Error("Email already in use.");
    error.statusCode = 401;
    throw error;
  }
  // hash password, create user object from usermodel and save user to database
  const hashedPw = await bcrypt.hash(password, 12);
  const user = new User({
    email: email,
    password: hashedPw,
    name: name,
  });
  const savedUser = await user.save();
  // send welcome email to user
  sgMail.send({
    to: email,
    from: config.sendgrid.sender,
    subject: `Welcome ${name}!`,
    text: "You have successfully signed up!",
    html: "<h1>You have successfully signed up!</h1><h2>Login to start taking notes on the app!</h2>",
  });
  // sign the user to get their jwt token and return it to the controller
  const token = jwt.sign({ ...savedUser }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return token;
};

exports.login = async (body) => {
  const { email, password } = body;
  let loadedUser;
  // check to see if user with entered email exists in database. If false, throw error
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error("A user with this email could not be found.");
    error.statusCode = 401;
    throw error;
  }
  loadedUser = user;
  // validate entered password with hashed password in database. If it doesnt match, throw error
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error("Wrong password!");
    error.statusCode = 401;
    throw error;
  }
  // sign the user to get their jwt token and return it to the controller
  const token = jwt.sign({ ...loadedUser }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return token;
};
