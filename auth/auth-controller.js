const service = require("./auth-service");

exports.signup = async (req, res, next) => {
  try {
    // call the service api to sign up user and retrieve returned jwt token to return it in the response
    const tokens = await service.signup(req.body);
    res.status(201).send(tokens);
  } catch (error) {
    //all controllers contain that catch block which sends the error to the express error middleware handler
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // call the service api to login user and retrieve returned jwt token to return it in the response
    const tokens = await service.login(req.body);
    res.status(200).send(tokens);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = await service.refresh(req.body);
    res.status(200).send(token);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await service.logout(req.body);
    res.status(200).send({ message: "Logout Successful!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await service.getUsers(req.query, req.body);
    res.status(200).send(users);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
