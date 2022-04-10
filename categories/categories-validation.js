const { Joi } = require("express-validation");
// package to be able to validate mongoDB id formats
Joi.objectId = require("joi-objectid")(Joi);

const categoryIdParams = Joi.object({
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
    params: categoryIdParams,
  },
  createCategory: {
    body: categoryNameBody,
  },
  updateCategory: {
    params: categoryIdParams,
    body: categoryNameBody,
  },
  deleteCategory: {
    body: categoryIdsArrayBody,
  },
};
