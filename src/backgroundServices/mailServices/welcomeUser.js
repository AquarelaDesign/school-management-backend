import SchoolFees from "../../models/schoolFeesModel.js";
import Student from "../../models/studentModel.js";
import User from "../../models/userModel.js";
import { sendMail } from "../helpers/emailHelpers.js";
import ejs from "ejs";

export const welcomeUser = async () => {
  const users = await User.find({ welcomed: false });

  for (let user of users) {
    console.log(user.firstName, user.email);

    ejs.renderFile(
      "templates/welcomeUser.ejs",
      { Name: user.firstName },
      async (error, data) => {
        let mailOptions = {
          from: "laserearts@gmail.com",
          to: user.email,
          subject: "You're In :)",
          html: data,
        };
        console.log("sending ", mailOptions);

        try {
          await sendMail(mailOptions);

          await User.updateOne({ _id: user._id }, { $set: { welcomed: true } });

          console.log("Emails send to new users");
        } catch (error) {
          console.log(error);
        }
      }
    );

    console.log("hellow");
  }
};
