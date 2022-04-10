const { Joi } = require("express-validation");
// package to be able to validate mongoDB id formats
Joi.objectId = require("joi-objectid")(Joi);

const getNotesBody = Joi.object({
  categoryId: Joi.objectId().optional(),
  tags: Joi.array().items(Joi.objectId()).min(1).optional(),
});

const noteIdParams = Joi.object({
  noteId: Joi.objectId().required(),
});

const createNoteBody = Joi.object({
  categoryId: Joi.objectId().required(),
  tags: Joi.array().items(Joi.objectId()).required(),
  content: Joi.string().not().empty().required(),
});

const noteIdsArrayBody = Joi.object({
  noteIds: Joi.array().items(Joi.objectId()).required(),
});

module.exports = {
  getNotes: {
    body: getNotesBody,
  },

  getNoteById: {
    params: noteIdParams,
  },

  createNote: {
    body: createNoteBody,
  },

  updateNote: {
    params: noteIdParams,
    body: createNoteBody,
  },

  deleteNote: {
    body: noteIdsArrayBody,
  },
};
