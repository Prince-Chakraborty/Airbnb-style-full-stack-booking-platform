const Listing = require("../models/listing");

// ==================== INDEX ====================
module.exports.index = async (req, res) => {
  try {
    let { search, filter, sort, page } = req.query;
    const ITEMS_PER_PAGE = 9;
    page = Number(page) || 1;

    let query = {};

    // SEARCH
    if (search && search.trim() !== "") {
      const escapeRegex = str =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { title: regex },
        { location: regex },
        { country: regex }
      ];
    }

    // FILTER
    if (filter && filter.trim() !== "") {
      query.type = filter;
    }

    // SORT
    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "trending") sortOption = { createdAt: -1 };

    const totalListings = await Listing.countDocuments(query);

    const allListings = await Listing.find(query)
      .sort(sortOption)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("owner");

    const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);

    res.render("listings/index.ejs", {
      allListings,
      search: search || "",
      filter: filter || "",
      sort: sort || "",
      currentPage: page,
      totalPages,
      activePage: "explore"
    });

  } catch (err) {
    console.error("INDEX ERROR:", err);
    req.flash("error", "Failed to load listings");
    res.redirect("/");
  }
};

// ==================== NEW ====================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs", {
    activePage: "newListing"
  });
};

// ==================== CREATE ====================
module.exports.createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};

// ==================== SHOW ====================
module.exports.showListings = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" }
      });

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
      listing,
      activePage: "explore"
    });
  } catch (err) {
    console.error("SHOW ERROR:", err);
    req.flash("error", "Failed to load listing");
    res.redirect("/listings");
  }
};

// ==================== EDIT ====================
module.exports.renderEditForm = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", {
      listing,
      activePage: "editListing"
    });
  } catch (err) {
    console.error("EDIT ERROR:", err);
    res.redirect("/listings");
  }
};

// ==================== UPDATE ====================
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      req.body.listing,
      { new: true }
    );

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// ==================== DELETE ====================
module.exports.destroyListing = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error("DELETE ERROR:", err);
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
};
