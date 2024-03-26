import asyncHandler from "express-async-handler";
import Teacher from "../models/teacherModel.js";
import User from "../models/userModel.js";

export const addTeacher = asyncHandler(async (req, res) => {
  console.log(req.body);
  const {
    email,
    firstName,
    lastName,
    gender,
    dob,
    religion,
    phone,
    nationalID,
    courses,
    school,
    status,
    lastLoginDate,
    lastLoginIp,
  } = req.body;
  const password = "teacherPassword123";
  const teacherExists = await Teacher.findOne({ email });

  if (teacherExists) {
    res.status(400);
    throw new Error("Teacher already exists");
  }

  const teacher = await Teacher.create({
    email,
    password,
    firstName,
    lastName,
    gender,
    dob,
    religion,
    phone,
    nationalID,
    courses,
    school,
    status,
    lastLoginDate,
    lastLoginIp,
  });

  if (teacher) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      firstName,
      secondName: lastName, // Assuming you have a variable named secondName
      email,
      password,
      userType: "Teacher",
      // Add other relevant fields based on your User schema
    });

    if (user) {
      res.status(200).json({
        message: "Teacher registered successfully",
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } else {
    res.status(400);
    throw new Error("Invalid teacher data");
  }
});

export const getAllTeachers = async (req, res) => {
  try {
    console.log("fetching all teachers");
    const teachers = await Teacher.find().populate("school");

    const teachersWithUserData = await Promise.all(
      teachers.map(async (teacher) => {
        const associatedUser = await User.findOne({ email: teacher.email });
        return {
          teacher,
          user: associatedUser,
        };
      })
    );

    console.log(teachersWithUserData);
    res.status(200).json({ success: true, data: teachersWithUserData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;
  const {
    email,
    firstName,
    lastName,
    gender,
    dob,
    religion,
    phone,
    nationalID,
    course,
    school,
    status,
    lastLoginDate,
    lastLoginIp,
  } = req.body;

  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  teacher.email = email || teacher.email;
  teacher.firstName = firstName || teacher.firstName;
  teacher.lastName = lastName || teacher.lastName;
  teacher.gender = gender || teacher.gender;
  teacher.dob = dob || teacher.dob;
  teacher.religion = religion || teacher.religion;
  teacher.phone = phone || teacher.phone;
  teacher.nationalID = nationalID || teacher.nationalID;
  teacher.course = course || teacher.course;
  teacher.school = school || teacher.school;
  teacher.status = status || teacher.status;
  teacher.lastLoginDate = lastLoginDate || teacher.lastLoginDate;
  teacher.lastLoginIp = lastLoginIp || teacher.lastLoginIp;

  const updatedTeacher = await teacher.save();

  // Update associated User
  const associatedUser = await User.findOne({ email });

  if (associatedUser) {
    associatedUser.firstName = firstName || associatedUser.firstName;
    associatedUser.secondName = lastName || associatedUser.secondName;
    associatedUser.email = email || associatedUser.email;

    await associatedUser.save();
  }

  res.status(200).json({
    success: true,
    data: updatedTeacher,
    message: "Teacher and associated User updated successfully",
  });
});

// Delete Teacher and associated User
export const deleteTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.id;

  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  // Find associated User and delete it
  const associatedUser = await User.findOne({ email: teacher.email });

  if (associatedUser) {
    await associatedUser.remove();
  }

  await teacher.remove();

  res.status(200).json({
    success: true,
    message: "Teacher and associated User deleted successfully",
  });
});
