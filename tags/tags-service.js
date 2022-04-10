const Tag = require("./tag-model");
const Note = require("../notes/note-model");
const errors = require("./tags-errors");

exports.getTags = async () => {
  // find all the tags of the loggedin user and return them to the controller
  const tags = await Tag.aggregate([
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "Tags",
        as: "notes",
      },
    },
  ]);
  return tags;
};

exports.getTagById = async (params) => {
  const tagId = params.tagId;
  //find the tag that has tagId, if not found throw error
  const tag = await Tag.findById(tagId);
  if (!tag) {
    const error = new Error(errors.tagNotFound);
    error.statusCode = 404;
    throw error;
  }
  // if everything works, return the tag to the controller
  return tag;
};

exports.createTag = async (userId, body) => {
  const name = body.name;
  // create tag object using tag model and save it to the database. Return it after saving it to the controller
  const tag = new Tag({
    name: name,
    createdBy: userId,
    updatedBy: userId,
  });
  const result = await tag.save();
  return result;
};

exports.updateTag = async (userId, body, params) => {
  const tagId = params.tagId;
  const name = body.name;
  //update the tag with the necessary information
  const result = await Tag.updateOne(
    {
      _id: tagId,
    },
    {
      $set: {
        name: name,
        updatedBy: userId,
      },
    }
  );
  // if no tag matches, throw error
  if (result.matchedCount == 0) {
    const error = new Error(errors.tagNotFound);
    error.statusCode = 404;
    throw error;
  }

  const tag = await Tag.findById(tagId);
  // return the updated tag to the controller
  return tag;
};

exports.deleteTagById = async (body) => {
  const tagId = body.tagId;

  // check to find if any notes is still linked to any of the tag that we want to delete and return their number
  const notesCount = await Note.find({
    tags: tagId,
  }).countDocuments();
  // if return number is not zero, that means that some notes are still linked and need to be unlinked before deletion. throw an error in this case
  if (notesCount > 0) {
    const error = new Error(errors.tagStillLinked);
    error.statusCode = 401;
    throw error;
  }
  // delete the tag
  const res = await Tag.deleteOne({
    _id: tagId,
  });
  // if no tag is deleted that means no tag match the id and throw an error
  if (res.deletedCount === 0) {
    const error = new Error(errors.tagNotFound);
    error.statusCode = 404;
    throw error;
  }
};
