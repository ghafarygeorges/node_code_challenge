// Third Party Packages
const express = require("express");
const { validate } = require("express-validation");

// Imported files
const isAuth = require("../middleware/is-auth");
const validator = require("./categories-validation");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./categories-controller");

const router = express.Router();

// use of the isAuth middleware for all the /categories/... routes
// the isAuth middleware validates if the user is loggedin and saves the user in the request
router.use("/", isAuth);

// validation of routes accordingly before executing their specified controller functions
router.get("/", getCategories);

router.get(
  "/id",
  validate(validator.getCategoryById, {}, { abortEarly: false }),
  getCategoryById
);

router.post(
  "/",
  validate(validator.createCategory, {}, { abortEarly: false }),
  createCategory
);

router.put(
  "/",
  validate(validator.updateCategory, {}, { abortEarly: false }),
  updateCategory
);

router.delete(
  "/",
  validate(validator.deleteCategory, {}, { abortEarly: false }),
  deleteCategory
);

module.exports = router;
