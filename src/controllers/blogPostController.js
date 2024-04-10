import asyncHandler from "express-async-handler";
import BlogPost from "../models/blogPostModel.js";
import multer, { diskStorage } from "multer";

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

const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    resume,
    allowComments,
    slug,
    author,
    seoTitle,
    seoKeywords,
    seoDescriptions,
  } = req.body;

  const userExists = await BlogPost.findOne({ email });

  if (!userExists) {
    error(res, 400, "EMAIL_NOT_FOUND");
  }

  const blogPost = await BlogPost.create({
    title,
    description,
    resume,
    allowComments,
    slug,
    author,
    seoTitle,
    seoKeywords,
    seoDescriptions,
  });

  if (blogPost) {
    res.status(201).json({
      _id: blogPost._id,
      title: blogPost.title,
      description: blogPost.description,
      resume: blogPost.resume,
      allowComments: blogPost.allowComments,
      slug: blogPost.slug,
      author: blogPost.author,
      seoTitle: blogPost.seoTitle,
      seoKeywords: blogPost.seoKeywords,
      seoDescriptions: blogPost.seoDescriptions,
      customFields: blogPost.customFields,
      status: blogPost.status,
      visibility: blogPost.visibility,
      date: blogPost.date,
      categories: blogPost.categories,
      tags: blogPost.tags,
      image: blogPost.image,
    });
  } else {
    return error(res, 400, "INVALID_BLOG_DATA");
  }
});

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPost = await BlogPost.find();
    res.status(200).json({ success: true, data: blogPost });
  } catch (error) {
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
};

const getAllBlogPostsByCategory = async (req, res) => {
  const blogPostCategory = req.params.category;
  try {
    const blogCategory = await BlogPost.find({ category: blogPostCategory });
    res.status(200).json({ success: true, data: blogCategory });
  } catch (error) {
    return error(res, 500, "INTERNAL_SERVER_ERROR");
  }
};

const updateBlog = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    resume,
    allowComments,
    slug,
    author,
    seoTitle,
    seoKeywords,
    seoDescriptions,
    customFields,
    status,
    visibility,
    date,
    categories,
    tags,
    image,
  } = req.body;
  // Update common blogPost details in blogPost model
  const blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return error(res, 400, "BLOG_NOT_FOUND");
  }

  blogPost.title = title || blogPost.title;
  blogPost.description = description || blogPost.description;
  blogPost.resume = resume || blogPost.resume;
  blogPost.allowComments = allowComments || blogPost.allowComments;
  blogPost.slug = slug || blogPost.slug;
  blogPost.author = author || blogPost.author;
  blogPost.seoTitle = seoTitle || blogPost.seoTitle;
  blogPost.seoKeywords = seoKeywords || blogPost.seoKeywords;
  blogPost.seoDescriptions = seoDescriptions || blogPost.seoDescriptions;
  blogPost.customFields = customFields || blogPost.customFields;
  blogPost.status = status || blogPost.status;
  blogPost.visibility = visibility || blogPost.visibility;
  blogPost.date = date || blogPost.date;
  blogPost.categories = categories || blogPost.categories;
  blogPost.tags = tags || blogPost.tags;
  blogPost.image = image || blogPost.image;

  const updatedblogPost = await BlogPost.save();
  const blogPostDetails = updatedblogPost.toObject();

  if (blogPostDetails) {
    res.status(200).json(blogPostDetails);
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

export { createBlog, getAllBlogPosts, getAllBlogPostsByCategory, updateBlog };
