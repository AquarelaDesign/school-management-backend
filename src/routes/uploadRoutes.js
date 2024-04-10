import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file", file);
    return cb(null, `./public/files/${file.fieldname}/`);
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      `${path.parse(file.originalname).name}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf|doc|docx|txt|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      "only .jpg, .jpeg, .png, .pdf, .doc, .docx, .txt, .xls, .xlsx  extensions allowed"
    );
  }
}

function checkFileTypeImages(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb("only .jpg, .jpeg, .png extensions allowed");
  }
}

function checkFileTypeDocs(file, cb) {
  const filetypes = /pdf|doc|docx|txt|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb("only .pdf, .doc, .docx, .txt, .xls and xlsx extensions allowed");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    return checkFileType(file, cb);
  },
});

const uploadImg = multer({
  storage,
  fileFilter: function (req, file, cb) {
    return checkFileTypeImages(file, cb);
  },
});

const uploadDoc = multer({
  storage,
  fileFilter: function (req, file, cb) {
    return checkFileTypeDocs(file, cb);
  },
});

const uploadImgs = uploadImg.single("users");
router.post("/users", function (req, res) {
  uploadImgs(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "", error: err });
    } else if (err) {
      res.status(400).json({ message: "", error: err });
    } else {
      res.status(200).json({ message: `/${req?.file?.path}`, error: "" });
    }
  });
});

const uploadDocs = uploadDoc.single("docs");
router.post("/docs", function (req, res) {
  uploadDocs(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "", error: err });
    } else if (err) {
      res.status(400).json({ message: "", error: err });
    } else {
      res.status(200).json({ message: `/${req?.file?.path}`, error: "" });
    }
  });
});

const uploads = upload.single("library");
router.post("/library", function (req, res) {
  uploads(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: "", error: err });
    } else if (err) {
      res.status(400).json({ message: "", error: err });
    } else {
      res.status(200).json({ message: `/${req?.file?.path}`, error: "" });
    }
  });
});

export default router;
