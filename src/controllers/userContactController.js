import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import UserContact from "../models/userContactModel.js";

// @desc    Create a new Contact
// @route   POST /api/user/contact
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const data = req.body;
  // const { type, contact, user } = data;

  const user = await User.findById(data[0].user);
  if (!user) {
    res.status(400);
    throw new Error("The user was not found!");
  }

  const createdContact = await UserContact.create(data);
  for (let a of createdContact) {
    user.contact.push(a._id);
    await user.save();
  }

  if (createdContact) {
    res.status(201).json(createdContact);
  } else {
    res.status(400);
    throw new Error("Invalid contact data");
  }
});

// @desc    Update an existing contact
// @route   PUT /api/user/contact/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const { type, contact, user } = req.body;

  const contacts = UserContact.findById(req.params.id);

  if (contacts) {
    const updatedContact = await UserContact.findByIdAndUpdate(req.params.id, {
      type: type, // || contacts.type,
      contact: contact, // || contacts.contact,
      user: user, // || contacts.user,
    });

    if (updatedContact) {
      const contactRes = await UserContact.findById(req.params.id);
      res.status(201).json(contactRes);
    } else {
      res.status(400);
      throw new Error("Invalid contact data");
    }
  } else {
    res.status(400);
    throw new Error("No contact was found");
  }
});

// @desc    Get a single contact by user
// @route   GET /api/user/contact/:id/:userId
// @access  Public
const getContactById = asyncHandler(async (req, res) => {
  const contact = await UserContact.find({
    _id: req.params.id,
  });

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

// @desc    Get all contact by user
// @route   GET /api/user/contact/:userId
// @access  Public
const getAllContactByUser = asyncHandler(async (req, res) => {
  const contact = await UserContact.find({ user: req.params.userId });

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

// @desc    Delete an contact by user
// @route   DELETE /api/user/contact/:id
// @access  Public
const deleteContactById = asyncHandler(async (req, res) => {
  const contact = await UserContact.findById(req.params.id);

  if (contact) {
    const user = await User.findById(contact.user);
    if (!user) {
      res.status(400);
      throw new Error("The user was not found!");
    }

    user.contact.pull(req.params.id);
    await user.save();

    await contact.remove();

    res.json({ message: "Contact removed" });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

export {
  createContact,
  updateContact,
  getContactById,
  getAllContactByUser,
  deleteContactById,
};
