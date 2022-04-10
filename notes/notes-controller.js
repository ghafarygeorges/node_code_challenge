const service = require("./notes-service");

// await all the service functions responses and catch errors in case they are thrown during the execution
// return respective responses
exports.getNotes = async (req, res, next) => {
  try {
    // notes : array of note objects
    const notes = await service.getNotes(req.user._id, req.body, req.query);
    res.status(200).send(notes);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    // note: note object
    const note = await service.getNoteById(req.user._id, req.params);
    res.status(200).send(note);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    // note: note object
    const note = await service.createNote(req.user._id, req.body);
    res.status(201).send(note);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    // note: note object
    const note = await service.updateNote(req.user._id, req.body, req.params);
    res.status(200).send(note);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    await service.deleteNote(req.body);
    // check if we are deleting one or many NOTES to format the response message accordingly
    let message = req.body.noteIds.length > 1 ? "Notes" : "Note";
    message += " successfully deleted!";
    res.status(200).send({ message: message });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
