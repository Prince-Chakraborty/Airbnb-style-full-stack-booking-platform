const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

// ---------- LOGIN CHECK ----------
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (!req.session.returnTo) {
      req.session.returnTo = req.originalUrl;
    }
    req.flash("error", "You must be logged in to continue!");
    return res.redirect("/login");
  }
  next();
};

// ---------- ALREADY LOGGED IN ----------
module.exports.alreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    const path = req.originalUrl;
    if (path === "/login" || path === "/signup") {
      return res.redirect("/listings");
    }
  }
  next();
};

// ---------- LISTING OWNER CHECK ----------
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "Permission denied");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// ---------- REVIEW AUTHOR CHECK ----------
module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// ---------- LISTING VALIDATION ----------
// ---------- LISTING VALIDATION ----------
module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) req.body.listing = {};

  // ✅ Convert price from string to number
  if (req.body.listing.price) {
    req.body.listing.price = Number(req.body.listing.price);
  }

  const { error } = listingSchema.validate({ listing: req.body.listing });

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);

    // Redirect dynamically based on route
    if (req.method === "POST") {
      return res.redirect("/listings/new");
    } else if (req.method === "PUT") {
      const { id } = req.params;
      return res.redirect(`/listings/${id}/edit`);
    } else {
      return res.redirect("/listings");
    }
  }
  next();
};


// ---------- REVIEW VALIDATION ----------
module.exports.validateReview = (req, res, next) => {
  if (!req.body.review) req.body.review = {};

  const { error } = reviewSchema.validate({ review: req.body.review });

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    const { id } = req.params;
    req.flash("error", msg);
    return res.redirect(`/listings/${id}`);
  }
  next();
};
