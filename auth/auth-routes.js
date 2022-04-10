// Third Party Packages
const express = require("express");
const { validate } = require("express-validation");

// Imported files
const validator = require("./auth-validation");
const {
  signup,
  login,
  getUsers,
  refresh,
  logout,
} = require("./auth-controller");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// validation of routes accordingly before executing their specified controller functions
// abortEarly: false makes the validation return all the found errors not just the first one
router.post(
  "/signup",
  validate(validator.signup, {}, { abortEarly: false }),
  signup
);

router.post(
  "/login",
  validate(validator.login, {}, { abortEarly: false }),
  login
);

router.post(
  "/refresh",
  validate(validator.refresh, {}, { abortEarly: false }),
  refresh
);

router.delete(
  "/logout",
  validate(validator.logout, {}, { abortEarly: false }),
  logout
);

router.get("/", isAuth, getUsers);

module.exports = router;
