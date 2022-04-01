const Note = require("./note-model");
const Category = require("../categories/category-model");

exports.getNotes = async (userId, body) => {
  // categoryId, tags and sort are all optional
  // categoryId is a mongoDB objectId for a specific category
  // tags is an array of strings
  // sort is either -1 (for desc) or 1 (for asc)
  // they are used to create vatiations of the getNotes function
  // if none is set, get all notes of the logged in user
  const { categoryId, tags, sort } = body;
  // Initialize the main filter which will be used for all types of getNotes requests
  const filter = {
    user: userId,
  };
  // if categoryId is set, add the category filter to make sure we are only getting notes for that specific category too
  if (categoryId) filter.category = categoryId;
  // if tags is set, also add the filter to return only notes that contain any of the tags that are sent in the request
  if (tags) {
    filter.tags = {
      $in: tags,
    };
  }
  // if sort is set, also sort ascending or descending by the updatedAt field
  // populate is used here to populate the category field in case the user needs information about the category
  const notes = sort
    ? await Note.find(filter).populate("category").sort({ updatedAt: sort })
    : await Note.find(filter).populate("category");
  // return found notes
  return notes;
};

exports.getNoteById = async (userId, query) => {
  const noteId = query.noteId;
  // find note that has noteId and populate its category. If not found, throw error
  const note = await Note.findById(noteId).populate("category");
  if (!note) {
    const error = new Error("Could not find note.");
    error.statusCode = 404;
    throw error;
  }
  // if creator of note different from loggedin user sending the request, throw error
  if (note.user.toString() !== userId) {
    const error = new Error("Not authorized!");
    error.statusCode = 403;
    throw error;
  }
  // return the found note
  return note;
};

exports.createNote = async (userId, body) => {
  const { content, categoryId, tags } = body;
  // in this case content, categoryId and tags are all required
  // make sure category that has categoryId exists and belongs to the user creating the note. if not throw error
  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    const error = new Error("Category does not exist!");
    error.statusCode = 404;
    throw error;
  }
  if (category.user.toString() !== userId) {
    const error = new Error("Not authorized to use this category!");
    error.statusCode = 403;
    throw error;
  }
  // create note using Note Model and save it to database
  const note = new Note({
    content: content,
    category: categoryId,
    user: userId,
    tags: tags,
  });
  const result = await note.save();
  return result;
};

exports.updateNote = async (userId, body, query) => {
  const noteId = query.noteId;
  const { content, categoryId, tags } = body;
  // in this case content, categoryId and tags are all required
  // make sure category that has categoryId exists and belongs to the user creating the note. if not throw error
  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    const error = new Error("Category does not exist!");
    error.statusCode = 404;
    throw error;
  }
  if (category.user.toString() !== userId) {
    const error = new Error("Not authorized to use this category!");
    error.statusCode = 403;
    throw error;
  }
  //find the note that matches the noteId and has the loggedin user as a creator. If found, update its content,categoryId and tags then return the updated document (new:true)
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
    },
    {
      $set: {
        content: content,
        category: categoryId,
        tags: tags,
      },
    },
    {
      new: true,
    }
  );
  // if no note was found and updated throw error
  if (!note) {
    const error = new Error("Could not find note.");
    error.statusCode = 404;
    throw error;
  }
  return note;
};

exports.deleteNote = async (userId, body) => {
  const noteIds = body.noteIds;
  // deleteNote is dynamic since it can both delete one or many notes
  // noteIds is an array of note Ids
  const res = await Note.deleteMany({
    _id: {
      $in: noteIds,
    },
    user: userId,
  });
  // if no notes were deleted, throw error
  if (res.deletedCount === 0) {
    const error = new Error("Could not find any matching notes to delete.");
    error.statusCode = 404;
    throw error;
  }
};
