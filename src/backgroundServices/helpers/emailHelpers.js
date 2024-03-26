import imaps from "imap-simple";
import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransport = (config) => {
  const transporter = nodemailer.createTransport(config);
  return transporter;
};

export const sendMail = async (messageOption) => {
  const { auth, email } = messageOption;
  console.log(messageOption);

  if (auth?.user && auth?.pass) {
    let configurations = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true" ? true : false,
      auth: {
        user: auth?.user,
        pass: auth?.pass,
      },
      requireTLS: false,
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = await createTransport(configurations);
    await transporter.verify();
    await transporter.sendMail(email, (error, info) => {
      console.log(error, info);
      if (error) {
        return {
          status: "error",
          error: error,
          info: "",
        };
      } else {
        return {
          status: "ok",
          error: "",
          info: info.response,
        };
      }
    });
  }
};

export const getMails = async (messageOption) => {
  const { auth } = messageOption;

  if (auth?.user && auth?.pass) {
    let configurations = {
      imap: {
        user: auth?.user,
        password: auth?.pass,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    return imaps.connect(configurations).then(function (connection) {
      return connection.openBox("INBOX").then(function () {
        var searchCriteria = ["ALL"]; //["UNSEEN", "SEEN"];

        var fetchOptions = {
          bodies: ["HEADER", "TEXT"],
          markSeen: false,
        };

        return connection
          .search(searchCriteria, fetchOptions)
          .then(function (results) {
            var subjects = results.map(function (res) {
              console.log(res);
              return res;
              // return res.parts.filter(function (part) {
              //   return part.which === "HEADER";
              // })[0].body.subject[0];
            });

            // console.log(results);
            return subjects;
          });
      });
    });

    /*
    try {
      const connection = await imaps.connect(configurations);
      console.log("CONNECTION SUCCESSFUL", new Date().toString());
      const box = await connection.openBox("INBOX");
      const searchCriteria = ["UNSEEN"];
      const fetchOptions = {
        bodies: ["HEADER", "TEXT"],
        markSeen: false,
      };
      const results = await connection.search(searchCriteria, fetchOptions);

      console.log("results", results);

      results.forEach((res) => {
        const text = res.parts.filter((part) => {
          return part.which === "TEXT";
        });
        let emailHTML = text[0].body;
        let emailText = convert(emailHTML);
        console.log(emailText);
      });
      connection.end();
    } catch (error) {
      console.log(error);
    }
    */
  }
};
