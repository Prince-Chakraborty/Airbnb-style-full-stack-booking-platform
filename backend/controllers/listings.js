const Listing = require("../models/listing");

// -------------------- LIST ALL LISTINGS (SEARCH, FILTER, SORT, PAGINATION) --------------------
module.exports.index = async (req, res) => {
  try {
    let { search, filter, sort, page } = req.query;
    page = parseInt(page) || 1;
    const limit = 9; // 9 listings per page

    let query = {};

    // ---------- SEARCH ----------
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { location: regex },
        { country: regex },
      ];
    }

    // ---------- FILTER ----------
    if (filter && filter.trim() !== "") {
      query.type = filter; // assuming each listing has a 'type' field matching filter
    }

    // ---------- COUNT TOTAL ----------
    const totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);

    // ---------- SORT ----------
    let sortOption = {};
    if (sort === "price-low") sortOption.price = 1;
    else if (sort === "price-high") sortOption.price = -1;
    else if (sort === "trending") sortOption.createdAt = -1; // newest first

    // ---------- FETCH LISTINGS ----------
    const allListings = await Listing.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("owner");

    res.render("listings/index.ejs", {
      allListings,
      currentPage: page,
      totalPages,
      search: search || "",
      filter: filter || "",
      sort: sort || "",
    });
  } catch (e) {
    req.flash("error", "Failed to load listings");
    res.redirect("/");
  }
};

// -------------------- SHOW SINGLE LISTING --------------------
module.exports.showListings = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        options: { sort: { _id: -1 } },
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (e) {
    req.flash("error", "Error fetching the listing");
    res.redirect("/listings");
  }
};

// -------------------- RENDER NEW FORM --------------------
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// -------------------- CREATE NEW LISTING --------------------
module.exports.createListing = async (req, res) => {
  try {
    const { listing } = req.body;

    const newListing = new Listing({
      title: listing.title || "Untitled Listing",
      description: listing.description || "",
      location: listing.location || "",
      country: listing.country || "",
      price: Number(listing.price) || 0,
      owner: req.user._id,
      type: listing.type || "rooms", // default type for filter
    });

    if (req.file) {
      newListing.image = {
        url: req.file.path.replace("\\", "/"),
        filename: req.file.filename,
      };
    } else {
      newListing.image = {
        url: "/images/default.jpg",
        filename: "default.jpg",
      };
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    req.flash("error", e.message || "Failed to create listing");
    res.redirect("back");
  }
};

// -------------------- RENDER EDIT FORM --------------------
module.exports.renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  } catch (e) {
    req.flash("error", "Failed to load edit form");
    res.redirect("/listings");
  }
};

// -------------------- UPDATE LISTING --------------------
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    listing.title = req.body.listing.title || listing.title;
    listing.description = req.body.listing.description || listing.description;
    listing.location = req.body.listing.location || listing.location;
    listing.country = req.body.listing.country || listing.country;
    if (req.body.listing.price !== undefined) {
      listing.price = Number(req.body.listing.price);
    }
    listing.type = req.body.listing.type || listing.type;

    if (req.file) {
      listing.image = {
        url: req.file.path.replace("\\", "/"),
        filename: req.file.filename,
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

// -------------------- DELETE LISTING --------------------
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
