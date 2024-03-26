import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";
import UserAndress from "../models/userAndressModel.js";

// @desc    Create a new Andress
// @route   POST /api/user/andress
// @access  Private
const createAndress = asyncHandler(async (req, res) => {
  const data = req.body;
  // const { type, zipCode, andress, number, complement, neighborhood, province, state, country, user } = data;

  const user = await User.findById(data[0].user);
  if (!user) {
    res.status(400);
    throw new Error("The user was not found!");
  }

  const createdAndress = await UserAndress.create(data);
  for (let a of createdAndress) {
    user.andress.push(a._id);
    await user.save();
  }

  if (createdAndress) {
    res.status(201).json(createdAndress);
  } else {
    res.status(400);
    throw new Error("Invalid andress data");
  }
});

// @desc    Update an existing andress
// @route   PUT /api/user/andress/:id
// @access  Private
const updateAndress = asyncHandler(async (req, res) => {
  const {
    type,
    zipCode,
    andress,
    number,
    complement,
    neighborhood,
    province,
    state,
    country,
    user,
  } = req.body;

  const andresses = UserAndress.findById(req.params.id);

  if (andresses) {
    const updatedAndress = await UserAndress.findByIdAndUpdate(req.params.id, {
      type: type, // || andresses.type,
      zipCode: zipCode, // || andresses.zipCode,
      andress: andress, // || andresses.andress,
      number: number, // || andresses.number,
      complement: complement, // || andresses.complement,
      neighborhood: neighborhood, // || andresses.neighborhood,
      province: province, // || andresses.province,
      state: state, // || andresses.state,
      country: country, // || andresses.country,
      user: user, // || andresses.user,
    });

    if (updatedAndress) {
      const andressRes = await UserAndress.findById(req.params.id);
      res.status(201).json(andressRes);
    } else {
      res.status(400);
      throw new Error("Invalid andress data");
    }
  } else {
    res.status(400);
    throw new Error("No andress was found");
  }
});

// @desc    Get a single andress by user
// @route   GET /api/user/andress/:id/:userId
// @access  Public
const getAndressById = asyncHandler(async (req, res) => {
  const andress = await UserAndress.find({
    _id: req.params.id,
  });

  if (andress) {
    res.json(andress);
  } else {
    res.status(404).json({ message: "Andress not found" });
  }
});

// @desc    Get all andress by user
// @route   GET /api/user/andress/:userId
// @access  Public
const getAllAndressByUser = asyncHandler(async (req, res) => {
  const andress = await UserAndress.find({ user: req.params.userId });

  if (andress) {
    res.json(andress);
  } else {
    res.status(404).json({ message: "Andress not found" });
  }
});

// @desc    Delete an andress by user
// @route   DELETE /api/user/andress/:id
// @access  Public
const deleteAndressById = asyncHandler(async (req, res) => {
  const andress = await UserAndress.findById(req.params.id);

  if (andress) {
    const user = await User.findById(andress.user);
    if (!user) {
      res.status(400);
      throw new Error("The user was not found!");
    }

    user.andress.pull(req.params.id);
    await user.save();

    await andress.remove();

    res.json({ message: "Andress removed" });
  } else {
    res.status(404).json({ message: "Andress not found" });
  }
});

export {
  createAndress,
  updateAndress,
  getAndressById,
  getAllAndressByUser,
  deleteAndressById,
};
