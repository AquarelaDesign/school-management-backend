import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Token from "../models/tokenModel.js";
import crypto from "crypto";
import fs from "fs";
import handlebars from "handlebars";
import useragent from "useragent";
import multer, { diskStorage } from "multer";
import sendEmail from "../utils/sendEmail.js";

import Personal from "../models/userPersonalModel.js";
import Contact from "../models/userContactModel.js";
import Document from "../models/userDocumentModel.js";
import Andress from "../models/userAndressModel.js";

const error = (res, code, message) => {
  return res.status(code).json({
    error: {
      code: code,
      errors: [
        {
          message: message,
          domain: "global",
          reason: "invalid",
        },
      ],
      message: message,
    },
  });
};

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .populate("personal")
    .populate("contact")
    .populate("document")
    .populate("andress");

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      return error(res, 400, "USER_DISABLED");
    }

    const userDetails = {
      user,
      token: generateToken(user._id),
    };

    res.json(userDetails);
  } else {
    if (!user) {
      return error(res, 400, "EMAIL_NOT_FOUND");
    }
    return error(res, 400, "INVALID_PASSWORD");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, userType, isAdmin } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    error(res, 400, "EMAIL_EXISTS");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    userType,
    isAdmin,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      userType: user.userType,
      verified: user.verified,
    });
  } else {
    return error(res, 400, "INVALID_USER_DATA");
  }
});

const templateFilePath = "backend/templates/reset-password-template.hbs";

// Function to read the contents of the HTML template file
const readHTMLFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (error, htmlContent) => {
      if (error) {
        reject(error);
      } else {
        resolve(htmlContent);
      }
    });
  });
};

// Function to compile and render the email template
const renderEmailTemplate = (template, data) => {
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
};

const sendRestPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (!user.isActive) {
      return error(res, 400, "USER_DISABLED");
    }

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.BASE_URL}new-password/${user._id}/${token.token}/`;

    // Example user agent string
    const userAgentString = req.headers["user-agent"];

    // Parse the user agent string
    const agent = useragent.parse(userAgentString);

    // Retrieve the browser name
    const browserName = agent.family;

    // Retrieve the operating system
    const operatingSystem = agent.os.toString();

    readHTMLFile(templateFilePath)
      .then((templateContent) => {
        // Define the data for the template variables
        const templateData = {
          baseurl: process.env.BASE_URL,
          name: user.firstName,
          email: user.email,
          browserName,
          operatingSystem,
          action_url: url,
        };

        // Render the email template with the data
        const renderedTemplate = renderEmailTemplate(
          templateContent,
          templateData
        );

        // Send the email
        sendEmail(user.email, "Reset Email", renderedTemplate)
          .then(() => {
            res.status(200).send({
              message: "Password reset link sent to your email account",
            });
          })
          .catch((error) => {
            console.log("Failed to send email:", error);
          });
      })
      .catch((error) => {
        return error(res, 400, "FILE_NOT_FOUND");
        console.log("Failed to read template file:", error);
      });
  } else {
    return error(res, 400, "EMAIL_NOT_FOUND");
  }
});

const verifyResetPassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return error(res, 400, "EMAIL_NOT_FOUND");
    }

    if (!user.isActive) {
      return error(res, 400, "USER_DISABLED");
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });
    console.log(user._id.toString());
    const resetPasswordLink = `${
      process.env.BASE_URL
    }new-password/${user._id.toString()}/${token.token}`;
    res.redirect(resetPasswordLink);
    // res.status(200).send(`${process.env.BASE_URL}new-password/${user._id.toString()}/${token.token}`);
  } catch (error) {
    console.log(error);
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
});

const setNewPassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return error(res, 400, "EMAIL_NOT_FOUND");
    }

    if (!user.isActive) {
      return error(res, 400, "USER_DISABLED");
    }

    const token = await Token.findOne({
      userId: req.params.id,
      token: req.params.token,
    });
    console.log({ userId: req.params.id, token: token });
    if (!token) return res.status(400).send({ message: "Invalid token link" });

    // if (!user.verified) return res.status(400).send({ message: "Invalid link" });
    // $2a$10$NkwMc8U5nV214hHBIQVNau6POGP2R4mv49Lb9cirTLY/Cb96I9sGi
    if (req.body.password) {
      user.password = req.body.password;
    }

    // const updatedUser = await user.save()

    // const salt = await bcrypt.genSalt(Number(process.env.SALT));
    // const hashPassword = await bcrypt.hash(req.body.password, salt);

    // user.password = hashPassword;
    await user.save();
    await token.remove();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
});

const getAllUsers = async (req, res) => {
  try {
    const userst = await User.find();
    res.status(200).json({ success: true, data: userst });
  } catch (error) {
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
};

const getAllTypeUsers = async (req, res) => {
  const userType = req.params.usertype;
  try {
    const userst = await User.find({ userType: userType });
    res.status(200).json({ success: true, data: userst });
  } catch (error) {
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
};

const updateProfile = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, userType, isAdmin, isActive } =
    req.body;
  // Update common user details in User model
  const user = await User.findById(req.params.id);

  if (!user) {
    return error(res, 400, "EMAIL_NOT_FOUND");
  }

  user.email = email || user.email;
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.userType = userType || user.userType;
  user.isAdmin = isAdmin || user.isAdmin;
  user.isActive = isActive || user.isActive;

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();
  const userDetails = updatedUser.toObject();

  if (userDetails) {
    res.status(200).json(userDetails);
  } else {
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
});

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const filename = file.originalname.toLowerCase().split(" ").join(".");
    cb(null, filename);
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .jpg,.jpeg and .png extensions allowed"));
    }
  },
});

export {
  authUser,
  registerUser,
  sendRestPassword,
  verifyResetPassword,
  setNewPassword,
  getAllUsers,
  getAllTypeUsers,
  updateProfile,
};
