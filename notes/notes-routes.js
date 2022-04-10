// Third Party Packages
const express = require("express");
const { validate } = require("express-validation");

// Imported Files
const isAuth = require("../middleware/is-auth");
const validator = require("./notes-validation");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("./notes-controller");

const router = express.Router();

// use of the isAuth middleware for all the /notes/... routes
// the isAuth middleware validates if the user is loggedin and saves the user in the request
router.use("/", isAuth);

// validation of routes accordingly before executing their specified controller functions
router.get(
  "/",
  validate(validator.getNotes, {}, { abortEarly: false }),
  getNotes
);

router.get(
  "/:noteId",
  validate(validator.getNoteById, {}, { abortEarly: false }),
  getNoteById
);

router.post(
  "/",
  validate(validator.createNote, {}, { abortEarly: false }),
  createNote
);

router.put(
  "/:noteId",
  validate(validator.updateNote, {}, { abortEarly: false }),
  updateNote
);

router.delete(
  "/",
  validate(validator.deleteNote, {}, { abortEarly: false }),
  deleteNote
);

module.exports = router;
