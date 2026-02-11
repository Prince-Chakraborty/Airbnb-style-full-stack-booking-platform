const Listing = require("../models/listing");

// ==================== CREATE LISTING ====================
module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);

    // ✅ Save Cloudinary images
    if (req.files && req.files.length > 0) {
      newListing.images = req.files.map(file => ({
        url: file.path,       // Cloudinary URL
        filename: file.filename,
      }));
    }

    // Set owner
    newListing.owner = req.user._id;

    // Save to DB
    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

// ==================== UPDATE LISTING ====================
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      req.body.listing,
      { new: true }
    );

    // Append new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        filename: file.filename,
      }));
      updatedListing.images = [...updatedListing.images, ...newImages];
    }

    await updatedListing.save();

    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${updatedListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// ==================== DELETE LISTING ====================
module.exports.destroyListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete listing.");
    res.redirect("/listings");
  }
};

// ==================== SHOW LISTING ====================
module.exports.showListings = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Calculate average rating
    let avgRating = 0;
    if (listing.reviews.length > 0) {
      avgRating = (
        listing.reviews.reduce((sum, r) => sum + r.rating, 0) /
        listing.reviews.length
      ).toFixed(1);
    }

    res.render("listings/show", { listing, avgRating });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load listing.");
    res.redirect("/listings");
  }
};

// ==================== RENDER NEW & EDIT FORMS ====================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load edit form.");
    res.redirect("/listings");
  }
};
