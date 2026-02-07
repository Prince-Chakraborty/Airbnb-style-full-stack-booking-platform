const Listing = require("../models/listing");
const Review = require("../models/review");

// Create a review
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
    req.flash("error", e.message || "Failed to add review");
    res.redirect("back");
  }
};

// Delete a review
module.exports.destroyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    // Ensure only author can delete
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to delete this review");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  } catch (e) {
    req.flash("error", e.message || "Failed to delete review");
    res.redirect("back");
  }
};
