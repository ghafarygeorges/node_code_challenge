const Category = require("./category-model");
const Note = require("../notes/note-model");

exports.getCategories = async (userId) => {
  // find all the categories of the loggedin user and return them to the controller
  const categories = await Category.find({ user: userId });
  return categories;
};

exports.getCategoryById = async (userId, query) => {
  const categoryId = query.categoryId;
  //find the category that has categoryId, if not found throw error
  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error("Could not find category.");
    error.statusCode = 404;
    throw error;
  }
  // if category is found but the creator of the category is different than the loggedin user, throw error
  if (category.user.toString() !== userId) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
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
    user: userId,
  });
  const result = await category.save();
  return result;
};

exports.updateCategory = async (userId, body, query) => {
  const categoryId = query.categoryId;
  const name = body.name;
  //find the category that matches the categoryId and has the loggedin user as a creator. If found, update its name and return the updated document (new:true)
  const category = await Category.findOneAndUpdate(
    {
      _id: categoryId,
      user: userId,
    },
    {
      $set: {
        name: name,
      },
    },
    {
      new: true,
    }
  );
  // if no category matches, throw error
  if (!category) {
    const error = new Error("Could not find category.");
    error.statusCode = 404;
    throw error;
  }
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
    const error = new Error(
      "Please make sure no notes are still linked to the categories you want to delete."
    );
    error.statusCode = 401;
    throw error;
  }
  // delete all the categories that have their ids in the categoryIds array and make sure that their creator is the loggedin user that is issuing the request
  const res = await Category.deleteMany({
    _id: {
      $in: categoryIds,
    },
    user: userId,
  });
  // if no categories are deleted that means no categories match the ids and throw an error
  if (res.deletedCount === 0) {
    const error = new Error(
      "Could not find any matching categories to delete."
    );
    error.statusCode = 404;
    throw error;
  }
};
