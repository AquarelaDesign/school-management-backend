import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import User from "./src/models/userModel.js";
import UserPersonal from "./src/models/userPersonalModel.js";
import UserContact from "./src/models/userContactModel.js";
import UserDocument from "./src/models/userDocumentModel.js";
import UserAndress from "./src/models/userAndressModel.js";
import School from "./src/models/schoolModel.js";
import Course from "./src/models/courseModel.js";

import { connectDB } from "./src/config/db.js";
import users from "./src/data/users.js";
import personal from "./src/data/personal.js";
import contact from "./src/data/contact.js";
import document from "./src/data/document.js";
import andress from "./src/data/andress.js";
import schools from "./src/data/schools.js";
import courses from "./src/data/courses.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await UserPersonal.deleteMany();
    await UserContact.deleteMany();
    await UserDocument.deleteMany();
    await UserAndress.deleteMany();
    await Course.deleteMany();
    await School.deleteMany();

    const createdPersonal = [];
    const createdContacts = [];
    const createdDocuments = [];
    const createdAndresses = [];

    const createdUser = await User.insertMany(users);

    let iUser = 1;
    for (const user of createdUser) {
      const user_id = user._id;

      // Personal
      const personalFiltered = personal.filter(
        (item) => item.user == `user_id_${iUser}`
      );

      const userPersonal = personalFiltered.map((personal) => ({
        ...personal,
        user: user_id,
      }));

      const createdPersonalForUser = await UserPersonal.insertMany(
        userPersonal
      );
      createdPersonal.push(...createdPersonalForUser);

      const cPersonal = createdPersonalForUser[0];

      // Update the user's personal with the created personal ID
      await User.findByIdAndUpdate(user_id, {
        $push: { personal: cPersonal },
      });

      // Contacts
      const contactFiltered = contact.filter(
        (item) => item.user == `user_id_${iUser}`
      );

      const userContacts = contactFiltered.map((contacts) => ({
        ...contacts,
        user: user_id,
      }));

      const createdContactsForUser = await UserContact.insertMany(userContacts);
      createdContacts.push(...createdContactsForUser);

      // Update the user's contacts with the created contacts ID's
      await User.findByIdAndUpdate(user_id, {
        $push: { contact: { $each: createdContactsForUser } },
      });

      // Documents
      const documentFiltered = document.filter(
        (item) => item.user == `user_id_${iUser}`
      );

      const userDocuments = documentFiltered.map((documents) => ({
        ...documents,
        user: user_id,
      }));

      const createdDocumentsForUser = await UserDocument.insertMany(
        userDocuments
      );
      createdDocuments.push(...createdDocumentsForUser);

      // Update the user's documents with the created documents ID's
      await User.findByIdAndUpdate(user_id, {
        $push: { document: { $each: createdDocumentsForUser } },
      });

      // Andresses
      const andressFiltered = andress.filter(
        (item) => item.user == `user_id_${iUser}`
      );

      const userAndresses = andressFiltered.map((andresses) => ({
        ...andresses,
        user: user_id,
      }));

      const createdAndressesForUser = await UserAndress.insertMany(
        userAndresses
      );
      createdAndresses.push(...createdAndressesForUser);

      // Update the user's andresses with the created andresses ID's
      await User.findByIdAndUpdate(user_id, {
        $push: { andress: { $each: createdAndressesForUser } },
      });

      iUser++;
    }

    const createdSchools = await School.insertMany(schools);
    const createdCourses = [];

    for (const school of createdSchools) {
      const school_id = school._id;

      const schoolCourses = courses.map((course) => ({
        ...course,
        school: school_id,
      }));

      const createdCoursesForSchool = await Course.insertMany(schoolCourses);
      createdCourses.push(...createdCoursesForSchool);

      // Update the school's courses array with the created course IDs
      await School.findByIdAndUpdate(school_id, {
        $push: { courses: { $each: createdCoursesForSchool } },
      });
    }

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`); // .red.inverse
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await UserPersonal.deleteMany();
    await UserContact.deleteMany();
    await UserDocument.deleteMany();
    await UserAndress.deleteMany();
    await Course.deleteMany();
    await School.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
