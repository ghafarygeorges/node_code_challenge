const { Joi } = require("express-validation");
// package to be able to validate mongoDB id formats
Joi.objectId = require("joi-objectid")(Joi);

const categoryIdQuery = Joi.object({
  categoryId: Joi.objectId().required(),
});

const categoryNameBody = Joi.object({
  name: Joi.string().not().empty().required(),
});

const categoryIdsArrayBody = Joi.object({
  categoryIds: Joi.array().items(Joi.objectId()).required(),
});

module.exports = {
  getCategoryById: {
    query: categoryIdQuery,
  },
  createCategory: {
    body: categoryNameBody,
  },
  updateCategory: {
    query: categoryIdQuery,
    body: categoryNameBody,
  },
  deleteCategory: {
    body: categoryIdsArrayBody,
  },
};
