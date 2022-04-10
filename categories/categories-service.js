const Category = require("./category-model");
const Note = require("../notes/note-model");
const errors = require("./categories-errors");

exports.getCategories = async () => {
  // find all the categories of the loggedin user and return them to the controller
  const categories = await Category.find({});
  return categories;
};

exports.getCategoryById = async (params) => {
  const categoryId = params.categoryId;
  //find the category that has categoryId, if not found throw error
  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error(errors.categoryNotFound);
    error.statusCode = 404;
    throw error;
  }
  // if everything works, return the category to the controller
  return category;
};

exports.createCategory = async (userId, body) => {
  const name = body.name;
  // create category object using category model and save it to the database. Return it after saving it to the controller
  const category = new Category({
    name: name,
    createdBy: userId,
    updatedBy: userId,
  });
  const result = await category.save();
  return result;
};

exports.updateCategory = async (userId, body, params) => {
  const categoryId = params.categoryId;
  const name = body.name;
  //update the cateogry with the necessary information
  const result = await Category.updateOne(
    {
      _id: categoryId,
    },
    {
      $set: {
        name: name,
        updatedBy: userId,
      },
    }
  );
  // if no category matches, throw error
  if (result.matchedCount == 0) {
    const error = new Error(errors.categoryNotFound);
    error.statusCode = 404;
    throw error;
  }

  const category = await Category.findById(categoryId);
  // return the updated category to the controller
  return category;
};

exports.deleteCategory = async (userId, body) => {
  const categoryIds = body.categoryIds;
  // deleteCategory is dynamic since it can both delete one or many categories
  // categoryIds is an array of category Ids

  // check to find if any notes is still linked to any of the categories that we want to delete and return their number
  const notesCount = await Note.find({
    category: {
      $in: categoryIds,
    },
  }).countDocuments();
  // if return number is not zero, that means that some notes are still linked and need to be unlinked before deletion. throw an error in this case
  if (notesCount > 0) {
    const error = new Error(errors.categoryStillLinked);
    error.statusCode = 401;
    throw error;
  }
  // delete all the categories that have their ids in the categoryIds array
  const res = await Category.deleteMany({
    _id: {
      $in: categoryIds,
    },
  });
  // if no categories are deleted that means no categories match the ids and throw an error
  if (res.deletedCount === 0) {
    const error = new Error(errors.categoryNotFound);
    error.statusCode = 404;
    throw error;
  }
};
