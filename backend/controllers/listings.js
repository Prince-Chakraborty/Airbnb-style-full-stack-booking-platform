const Listing = require("../models/listing");

// List all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// Show a single listing
module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Render form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Create new listing
module.exports.createListing = async (req, res) => {
    try {
        const { listing } = req.body;

        const newListing = new Listing({
            title: listing.title || "Untitled Listing",
            description: listing.description || "",
            location: listing.location || "",
            country: listing.country || "",
            price: listing.price || 0,
            owner: req.user._id
        });

        if (req.file) {
            newListing.image = {
                url: req.file.path.replace("\\", "/"),
                filename: req.file.filename
            };
        } else {
            newListing.image = { url: "/images/default.jpg", filename: "default.jpg" };
        }

        await newListing.save();

        req.flash("success", "New Listing Created!");
        res.redirect(`/listings/${newListing._id}`);
    } catch (e) {
        // Always flash a string
        req.flash("error", e.message || "Failed to create listing");
        res.redirect("back");
    }
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// Update listing
module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Only update primitive fields — avoid spreading objects
        listing.title = req.body.listing.title || listing.title;
        listing.description = req.body.listing.description || listing.description;
        listing.location = req.body.listing.location || listing.location;
        listing.country = req.body.listing.country || listing.country;
        listing.price = req.body.listing.price || listing.price;

        // Update image if uploaded
        if (req.file) {
            listing.image = {
                url: req.file.path.replace("\\", "/"),
                filename: req.file.filename
            };
        }

        await listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${listing._id}`);
    } catch (e) {
        req.flash("error", e.message || "Failed to update listing");
        res.redirect("back");
    }
};

// Delete listing
module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message || "Failed to delete listing");
        res.redirect("back");
    }
};
