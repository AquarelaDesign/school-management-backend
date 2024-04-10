import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Comment = new Schema();

Comment.add({
  title: {
    type: String,
    index: true,
  },
  date: Date,
  body: String,
  comments: [Comment],
});

const blogPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: false,
    },
    customFields: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogCustomFields",
      },
    ],
    allowComments: {
      type: Boolean,
      default: true,
    },
    comments: [Comment],
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    author: Schema.ObjectId,
    seoTitle: {
      type: String,
      required: false,
    },
    seoKeywords: {
      type: String,
      required: false,
    },
    seoDescriptions: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Published", "Pending"],
      default: "Pending",
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private",
    },
    date: Date,
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogCategory",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogTag",
      },
    ],
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj7nmvPuHivliG0y_2glZDqMW3aZ4pbd8pzw&usqp=CAU",
    },

    buf: Buffer,
  },
  {
    timestamps: true,
  }
);

/**
 * Accessing a specific schema type by key
 */

blogPostSchema
  .path("date")
  .default(function () {
    return new Date();
  })
  .set(function (v) {
    return v === "now" ? new Date() : v;
  });

/**
 * Pre hook.
 */

blogPostSchema.pre("save", function (next, done) {
  /* global emailAuthor */
  emailAuthor(done); // some async function
  next();
});

/**
 * Methods
 */

blogPostSchema.methods.findAuthor = function (callback) {
  return this.db.model("user").findById(this.author, callback);
};

blogPostSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
};

blogPostSchema.methods.expressiveQuery = function (author, date, callback) {
  return this.find("author", author).where("date").gte(date).run(callback);
};

/**
 * Plugins
 */

function slugGenerator(options) {
  options = options || {};
  const key = options.key || "title";

  return function slugGenerator(schema) {
    schema.path(key).set(function (v) {
      this.slug = v
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/-+/g, "");
      return v;
    });
  };
}

blogPostSchema.plugin(slugGenerator());

const blogPost = mongoose.model("blogPost", blogPostSchema);
export default blogPost;
