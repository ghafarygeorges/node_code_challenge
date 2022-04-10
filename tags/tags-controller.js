const service = require("./tags-service");

// await all the service functions responses and catch errors in case they are thrown during the execution
// return respective responses
exports.getTags = async (req, res, next) => {
  try {
    // tags: array of tags objects
    const tags = await service.getTags();
    res.status(200).send(tags);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTagById = async (req, res, next) => {
  try {
    // tag: tag object
    const tag = await service.getTagById(req.params);
    res.status(200).send(tag);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    // tag: tag object
    const tag = await service.createTag(req.user._id, req.body);
    res.status(201).send(tag);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    // tag: tag object
    const tag = await service.updateTag(req.user._id, req.body, req.params);
    res.status(200).send(tag);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTagById = async (req, res, next) => {
  try {
    await service.deleteTagById(req.body);
    res.status(200).send({ message: "Tag successfully deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
