const service = require("./auth-service");

exports.signup = async (req, res, next) => {
  try {
    // call the service api to sign up user and retrieve returned jwt token to return it in the response
    const token = await service.signup(req.body);
    res.status(201).send({
      message: "User created successfully!",
      token: token,
    });
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
    const token = await service.login(req.body);
    res.status(200).send({
      message: "Login successful!",
      token: token,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
