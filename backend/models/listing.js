const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description cannot be empty"],
      trim: true,
    },

    // ✅ MULTIPLE IMAGES SUPPORT
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          filename: {
            type: String,
            required: true,
          },
        },
      ],
      default: [
        {
          url: "/images/default.jpg",
          filename: "default.jpg",
        },
      ],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be a valid positive number"],
    },

    type: {
      type: String,
      required: true,
      enum: [
        "trending",
        "rooms",
        "iconic",
        "mountains",
        "castles",
        "pools",
        "camping",
        "farms",
        "arctic",
        "domes",
        "boats",
      ],
      index: true,
      default: "trending",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      index: true,
    },

    country: {
      type: String,
      required: [true, "Country is required"],
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Delete associated reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.reviews.length) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
