const mongoose = require("mongoose");
const slugify = require("slugify");

const RentDigiBlogSchema = new mongoose.Schema(
  {
    image: {
      type: [{ type: String }],
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    author: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

RentDigiBlogSchema.pre("save", function (next) {
  this.slug = slugify(this.slug, { lower: true, remove: /[*+~.()'"!:@]/g });
  next();
});

const rentdigiblog = new mongoose.model("rentdigiblog", RentDigiBlogSchema);

module.exports = {
  rentdigiblog,
};
