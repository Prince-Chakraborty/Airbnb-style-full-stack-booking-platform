const Listing = require("../models/listing");
const Review = require("../models/review");

// ================= CREATE REVIEW =================
module.exports.createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    console.error("REVIEW CREATE ERROR:", e);
    req.flash("error", "Failed to add review");
    res.redirect(`/listings/${req.params.id}`);
  }
};

// ================= DELETE REVIEW =================
module.exports.destroyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  } catch (e) {
    console.error("REVIEW DELETE ERROR:", e);
    req.flash("error", "Failed to delete review");
    res.redirect(`/listings/${req.params.id}`);
  }
};
