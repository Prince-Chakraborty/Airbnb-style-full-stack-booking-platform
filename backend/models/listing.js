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
    image: {
      url: {
        type: String,
        default: "/images/default.jpg",
      },
      filename: {
        type: String,
        default: "default.jpg",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // ✅ REQUIRED FOR FILTERS
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
        "boats"
      ],
      index: true
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
