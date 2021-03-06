const service = require("./categories-service");

// await all the service functions responses and catch errors in case they are thrown during the execution
// return respective responses
exports.getCategories = async (req, res, next) => {
  try {
    // categories: array of category objects
    const categories = await service.getCategories();
    res.status(200).send(categories);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    // category: category object
    const category = await service.getCategoryById(req.params);
    res.status(200).send(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    // category: category object
    const category = await service.createCategory(req.user._id, req.body);
    res.status(201).send(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    // category: category object
    const category = await service.updateCategory(
      req.user._id,
      req.body,
      req.params
    );
    res.status(200).send(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await service.deleteCategory(req.body);
    // check if we are deleting one or many categories to format the response message accordingly
    let message = req.body.categoryIds.length > 1 ? "Categories" : "Category";
    message += " successfully deleted!";
    res.status(200).send({ message: message });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
