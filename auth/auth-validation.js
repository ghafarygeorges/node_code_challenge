const { Joi } = require("express-validation");

//Validation of different data that are sent in requests

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signupValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().not().empty().required(),
});

module.exports = {
  login: {
    body: loginValidation,
  },
  signup: {
    body: signupValidation,
  },
};
