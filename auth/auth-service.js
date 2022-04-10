// Third Party Packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

// Imported files
const User = require("./user-model");
const Token = require("./token-model");
const config = require("../app-config");
const errors = require("./auth-errors");

sgMail.setApiKey(config.sendgrid.key);

exports.getUsers = async (query, body) => {
  //optional params
  let page = query.page;
  let limit = body.limit;

  // default limit is 20 and default page is 1
  limit = !limit || isNaN(parseInt(limit)) || limit < 1 ? 20 : parseInt(limit);
  page = !page || isNaN(parseInt(page)) || page < 1 ? 1 : parseInt(page);
  const users = User.aggregate([
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "User",
        as: "notes",
      },
    },
    {
      $project: {
        email: 1,
        name: 1,
        notesCount: {
          $size: "$notes",
        },
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);
  return users;
};

exports.signup = async (body) => {
  const { email, name, password } = body;
  // find if user with email exists already. If true, throw error
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    const error = new Error(errors.signup.emailAlreadyInUse);
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
  const signedUser = { ...savedUser }._doc;
  delete signedUser.password;

  const accessToken = jwt.sign(signedUser, config.jwt.accessSecret, {
    expiresIn: config.jwt.expiresIn,
  });
  const refreshToken = jwt.sign(signedUser, config.jwt.refreshSecret);
  await new Token({ token: refreshToken }).save();
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

exports.login = async (body) => {
  const { email, password } = body;
  let loadedUser;
  // check to see if user with entered email exists in database. If false, throw error
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error(errors.login.emailNotFound);
    error.statusCode = 401;
    throw error;
  }
  loadedUser = user;
  // validate entered password with hashed password in database. If it doesnt match, throw error
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error(errors.login.wrongPassword);
    error.statusCode = 401;
    throw error;
  }
  // sign the user to get their jwt token and return it to the controller
  const signedUser = { ...loadedUser }._doc;
  delete signedUser.password;

  const accessToken = jwt.sign(signedUser, config.jwt.accessSecret, {
    expiresIn: config.jwt.expiresIn,
  });
  const refreshToken = jwt.sign(signedUser, config.jwt.refreshSecret);
  await new Token({ token: refreshToken }).save();
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

exports.refresh = async (body) => {
  const refreshToken = body.token;
  if (!refreshToken) {
    const error = new Error(errors.refresh.notAuthenticated);
    error.statusCode = 401;
    throw error;
  }
  const token = Token.findOne({ token: refreshToken });
  if (!token) {
    const error = new Error(errors.refresh.invalidToken);
    error.statusCode = 403;
    throw error;
  }
  const decodedToken = jwt.verify(refreshToken, config.jwt.refreshSecret);
  if (!decodedToken) {
    const error = new Error(errors.refresh.notAuthenticated);
    error.statusCode = 403;
    throw error;
  }
  delete decodedToken.iat;
  const accessToken = jwt.sign(decodedToken, config.jwt.accessSecret, {
    expiresIn: config.jwt.expiresIn,
  });

  return {
    accessToken: accessToken,
  };
};

exports.logout = async (body) => {
  await Token.deleteOne({ token: body.token });
};
