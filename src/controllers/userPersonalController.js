import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import UserPersonal from "../models/userPersonalModel.js";

// @desc    Create a new Personal
// @route   POST /api/user/personal
// @access  Private
const createPersonal = asyncHandler(async (req, res) => {
  const data = req.body;
  // const { fullName, gender, dob, religion, photo, yearOfStudy } = data;
  const personal = await UserPersonal.find({ user: data.user });

  if (personal && personal.length > 0) {
    res.status(400).json(personal[0]);
    throw new Error("There is already personal info for this user");
  } else {
    const createdPersonalForUser = await UserPersonal.insertMany(data);
    const createdPersonal = createdPersonalForUser[0];

    // Update the user's personal with the created personal ID
    await User.findByIdAndUpdate(data.user, {
      personal: createdPersonal._id,
    });

    if (createdPersonal) {
      res.status(201).json(createdPersonal);
    } else {
      res.status(400);
      throw new Error("Invalid personal data");
    }
  }
});

// @desc    Update an existing personal info
// @route   PUT /api/user/personal/:id
// @access  Private
const updatePersonal = asyncHandler(async (req, res) => {
  const { fullName, gender, dob, religion, photo, yearOfStudy } = req.body;

  const personal = UserPersonal.findById(req.params.id);

  if (personal) {
    const updatedPersonal = await UserPersonal.findByIdAndUpdate(
      req.params.id,
      {
        fullName: fullName || personal.fullName,
        gender: gender || personal.gender,
        dob: dob || personal.dob,
        religion: religion || personal.religion,
        photo: photo || personal.photo,
        yearOfStudy: yearOfStudy || personal.yearOfStudy,
      }
    );

    if (updatedPersonal) {
      const personalRes = await UserPersonal.findById(req.params.id);
      res.status(201).json(personalRes);
    } else {
      res.status(400);
      throw new Error("Invalid personal data");
    }
  } else {
    res.status(400);
    throw new Error("No personal info was found");
  }
});

// @desc    Get a single personal info by user
// @route   GET /api/user/personal/:id/:userId
// @access  Public
const getPersonalById = asyncHandler(async (req, res) => {
  const personal = await UserPersonal.find({
    _id: req.params.id,
  });

  if (personal) {
    res.json(personal);
  } else {
    res.status(404).json({ message: "Personal info not found" });
  }
});

// @desc    Get all personal info by user
// @route   GET /api/user/personal/:userId
// @access  Public
const getAllPersonalByUser = asyncHandler(async (req, res) => {
  const personal = await UserPersonal.find({ user: req.params.userId });

  if (personal) {
    res.json(personal);
  } else {
    res.status(404).json({ message: "Personal info not found" });
  }
});

// @desc    Delete an personal info by user
// @route   DELETE /api/user/personal/:id
// @access  Public
const deletePersonalById = asyncHandler(async (req, res) => {
  const personal = await UserPersonal.findById(req.params.id);

  if (personal) {
    await User.findByIdAndUpdate(personal.user, {
      personal: null,
    });

    await UserPersonal.remove();

    res.json({ message: "Personal info removed" });
  } else {
    res.status(404).json({ message: "Personal info not found" });
  }
});

export {
  createPersonal,
  updatePersonal,
  getPersonalById,
  getAllPersonalByUser,
  deletePersonalById,
};
