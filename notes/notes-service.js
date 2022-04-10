const Note = require("./note-model");
const mongoose = require("mongoose");
const errors = require("./note-errors");

exports.getNotes = async (userId, body, query) => {
  // categoryId, tags are optional
  // categoryId is a mongoDB objectId for a specific category
  // tags is an array of mongoDB objectIds for specific tags
  // sortField to designate which field to use for sorting
  // sort is either -1 (for desc) or 1 (for asc)
  // they are used to create vatiations of the getNotes function
  // if none is set, get all notes of the logged in user
  const { categoryId, tags } = body;

  let { sortField, sort } = query;

  // if sortField or sort not set, take updatedAt and descending as default
  sortField = !sortField ? "updatedAt" : sortField;
  sort = !sort || isNaN(parseInt(sort)) ? -1 : parseInt(sort);

  const filter = {};
  // if categoryId is set, add the category filter to make sure we are only getting notes for that specific category too
  if (categoryId) filter.Category = mongoose.Types.ObjectId(categoryId);
  // if tags is set, also add the filter to return only notes that contain any of the tags that are sent in the request
  if (tags) {
    filter.Tags = {
      $in: tags.map((tag) => mongoose.Types.ObjectId(tag)),
    };
  }

  const notesAggregation = [
    { $match: { User: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "categories",
        let: {
          category: "$Category",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$category"],
              },
            },
          },
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "Category",
      },
    },
    { $unwind: { path: "$Category", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$Tags", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "tags",
        localField: "Tags",
        foreignField: "_id",
        as: "Tags",
      },
    },
    {
      $unwind: { path: "$Tags", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$_id",
        content: {
          $first: "$content",
        },
        Category: {
          $first: "$Category",
        },
        User: {
          $first: "$User",
        },
        Tags: {
          $push: {
            _id: "$Tags._id",
            name: "$Tags.name",
          },
        },
        createdBy: {
          $first: "$createdBy",
        },
        updatedBy: {
          $first: "$updatedBy",
        },
        createdAt: {
          $first: "$createdAt",
        },
        updatedAt: {
          $first: "$updatedAt",
        },
      },
    },
    { $sort: { [sortField]: sort } },
  ];

  // adding filters
  if (Object.keys(filter).length > 0) {
    notesAggregation.unshift({ $match: filter });
  }

  const notes = await Note.aggregate(notesAggregation);
  // return found notes
  return notes;
};

exports.getNoteById = async (userId, params) => {
  const noteId = params.noteId;
  // find note that has noteId and populate its category. If not found, throw error
  const noteAggregation = [
    {
      $match: {
        User: mongoose.Types.ObjectId(userId),
        _id: mongoose.Types.ObjectId(noteId),
      },
    },
    {
      $lookup: {
        from: "categories",
        let: {
          category: "$Category",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$category"],
              },
            },
          },
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "Category",
      },
    },
    { $unwind: { path: "$Category", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$Tags", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "tags",
        localField: "Tags",
        foreignField: "_id",
        as: "Tags",
      },
    },
    {
      $unwind: { path: "$Tags", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$_id",
        content: {
          $first: "$content",
        },
        Category: {
          $first: "$Category",
        },
        User: {
          $first: "$User",
        },
        Tags: {
          $push: {
            _id: "$Tags._id",
            name: "$Tags.name",
          },
        },
        createdBy: {
          $first: "$createdBy",
        },
        updatedBy: {
          $first: "$updatedBy",
        },
        createdAt: {
          $first: "$createdAt",
        },
        updatedAt: {
          $first: "$updatedAt",
        },
      },
    },
  ];
  const note = await Note.aggregate(noteAggregation);
  if (!note) {
    const error = new Error(errors.noteNotFound);
    error.statusCode = 404;
    throw error;
  }
  // return the found note
  return note[0];
};

exports.createNote = async (userId, body) => {
  const { content, categoryId, tags } = body;
  // in this case content, categoryId and tags are all required
  // create note using Note Model and save it to database
  const note = new Note({
    content: content,
    Category: categoryId,
    User: userId,
    Tags: tags,
    updatedBy: userId,
    createdBy: userId,
  });
  const result = await note.save();
  return result;
};

exports.updateNote = async (userId, body, params) => {
  const noteId = params.noteId;
  const { content, categoryId, tags } = body;
  // in this case content, categoryId and tags are all required
  //find the note that matches the noteId and has the loggedin user as a creator. If found, update its content,categoryId and tags then return the updated document (new:true)
  const result = await Note.updateOne(
    {
      _id: noteId,
    },
    {
      $set: {
        content: content,
        Category: categoryId,
        Tags: tags,
        updatedBy: userId,
      },
    }
  );

  if (result.matchedCount == 0) {
    const error = new Error(errors.noteNotFound);
    error.statusCode = 404;
    throw error;
  }

  const note = Note.findById(noteId);
  return note;
};

exports.deleteNote = async (body) => {
  const noteIds = body.noteIds;
  // deleteNote is dynamic since it can both delete one or many notes
  // noteIds is an array of note Ids
  const res = await Note.deleteMany({
    _id: {
      $in: noteIds,
    },
  });
  // if no notes were deleted, throw error
  if (res.deletedCount === 0) {
    const error = new Error(errors.noteNotFound);
    error.statusCode = 404;
    throw error;
  }
};
