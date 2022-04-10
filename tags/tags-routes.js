// Third Party Packages
const express = require("express");
const { validate } = require("express-validation");

// Imported files
const isAuth = require("../middleware/is-auth");
const validator = require("./tags-validation");
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTagById,
} = require("./tags-controller");

const router = express.Router();

// use of the isAuth middleware for all the /tags/... routes
// the isAuth middleware validates if the user is loggedin and saves the user in the request
router.use("/", isAuth);

// validation of routes accordingly before executing their specified controller functions
router.get("/", getTags);

router.get(
  "/:tagId",
  validate(validator.getTagById, {}, { abortEarly: false }),
  getTagById
);

router.post(
  "/",
  validate(validator.createTag, {}, { abortEarly: false }),
  createTag
);

router.put(
  "/:tagId",
  validate(validator.updateTag, {}, { abortEarly: false }),
  updateTag
);

router.delete(
  "/",
  validate(validator.deleteTagById, {}, { abortEarly: false }),
  deleteTagById
);

module.exports = router;
