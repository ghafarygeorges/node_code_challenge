const { Joi } = require("express-validation");
// package to be able to validate mongoDB id formats
Joi.objectId = require("joi-objectid")(Joi);

const tagsIdParams = Joi.object({
  tagsId: Joi.objectId().required(),
});

const tagsNameBody = Joi.object({
  name: Joi.string().not().empty().required(),
});

const tagIdBody = Joi.object({
  tagId: Joi.objectId().required(),
});

module.exports = {
  getTagById: {
    params: tagsIdParams,
  },
  createTag: {
    body: tagsNameBody,
  },
  updateTag: {
    params: tagsIdParams,
    body: tagsNameBody,
  },
  deleteTagById: {
    body: tagIdBody,
  },
};
