import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import UserDocument from "../models/userDocumentModel.js";

// @desc    Create a new Document
// @route   POST /api/user/document
// @access  Private
const createDocument = asyncHandler(async (req, res) => {
  const data = req.body;
  // const { type, idNumber, issuingBody, shippingDate, user } = data;

  const user = await User.findById(data[0].user);
  if (!user) {
    res.status(400);
    throw new Error("The user was not found!");
  }

  const createdDocument = await UserDocument.create(data);
  for (let a of createdDocument) {
    user.document.push(a._id);
    await user.save();
  }

  if (createdDocument) {
    res.status(201).json(createdDocument);
  } else {
    res.status(400);
    throw new Error("Invalid document data");
  }
});

// @desc    Update an existing document
// @route   PUT /api/user/document/:id
// @access  Private
const updateDocument = asyncHandler(async (req, res) => {
  const { type, idNumber, issuingBody, shippingDate, user } = req.body;

  const documents = UserDocument.findById(req.params.id);

  if (documents) {
    const updatedDocument = await UserDocument.findByIdAndUpdate(
      req.params.id,
      {
        type: type, // || documents.type,
        idNumber: idNumber, // || documents.idNumber,
        issuingBody: issuingBody, // || documents.issuingBody,
        shippingDate: shippingDate, // || documents.shippingDate,
        user: user, // || documents.user,
      }
    );

    if (updatedDocument) {
      const documentRes = await UserDocument.findById(req.params.id);
      res.status(201).json(documentRes);
    } else {
      res.status(400);
      throw new Error("Invalid document data");
    }
  } else {
    res.status(400);
    throw new Error("No document was found");
  }
});

// @desc    Get a single document by user
// @route   GET /api/user/document/:id/:userId
// @access  Public
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await UserDocument.find({
    _id: req.params.id,
  });

  if (document) {
    res.json(document);
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});

// @desc    Get all document by user
// @route   GET /api/user/document/:userId
// @access  Public
const getAllDocumentByUser = asyncHandler(async (req, res) => {
  const document = await UserDocument.find({ user: req.params.userId });

  if (document) {
    res.json(document);
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});

// @desc    Delete an document by user
// @route   DELETE /api/user/document/:id
// @access  Public
const deleteDocumentById = asyncHandler(async (req, res) => {
  const document = await UserDocument.findById(req.params.id);

  if (document) {
    const user = await User.findById(document.user);
    if (!user) {
      res.status(400);
      throw new Error("The user was not found!");
    }

    user.document.pull(req.params.id);
    await user.save();

    await document.remove();

    res.json({ message: "Document removed" });
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});

export {
  createDocument,
  updateDocument,
  getDocumentById,
  getAllDocumentByUser,
  deleteDocumentById,
};
