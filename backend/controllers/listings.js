const Listing = require("../models/listing");

// -------------------- INDEX --------------------
// -------------------- INDEX (Part 1: Listings Page) --------------------
module.exports.index = async (req, res) => {
  try {
    let { search, filter, sort, page } = req.query;
    const ITEMS_PER_PAGE = 9; // 9 listings per page
    page = Number(page) || 1;

    let query = {};

    // SEARCH by title, location, country
    if (search && search.trim() !== "") {
      const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { title: regex },
        { location: regex },
        { country: regex }
      ];
    }

    // FILTER by type/category (trending, rooms, mountains, pools, castles)
    if (filter && filter.trim() !== "") {
      query.type = filter; // ensure 'type' field exists in Listing schema
    }

    // COUNT total listings for pagination
    const totalListings = await Listing.countDocuments(query);

    // SORT
    let sortOption = {};
    if (sort === "price-low") sortOption.price = 1;
    else if (sort === "price-high") sortOption.price = -1;
    else if (sort === "trending") sortOption.createdAt = -1;

    // FETCH paginated results
    const allListings = await Listing.find(query)
      .sort(sortOption)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("owner"); // fetch owner info

    const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);

    // RENDER listings page
    res.render("listings/index.ejs", {
      allListings: allListings || [],
      search: search || "",
      filter: filter || "",
      sort: sort || "",
      currentPage: page,
      totalPages: totalPages || 1,
      activePage: "explore" // fixes navbar ReferenceError
    });

  } catch (e) {
    console.error("Listings Index Error:", e);
    req.flash("error", "Failed to load listings");
    res.redirect("/");
  }
};


// -------------------- NEW --------------------
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs", {
    activePage: "newListing" // ✅ added
  });
};

// -------------------- CREATE --------------------
module.exports.createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    if (req.file) listing.image = req.file.path;
    await listing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    console.error("Create Listing Error:", e);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};

// -------------------- SHOW --------------------
module.exports.showListings = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { 
      listing,
      activePage: "explore" // ✅ added
    });
  } catch (e) {
    console.error("Show Listing Error:", e);
    req.flash("error", "Failed to load listing");
    res.redirect("/listings");
  }
};

// -------------------- EDIT --------------------
module.exports.renderEditForm = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { 
      listing,
      activePage: "editListing" // ✅ added
    });
  } catch (e) {
    console.error("Edit Listing Error:", e);
    req.flash("error", "Failed to load edit form");
    res.redirect("/listings");
  }
};

// -------------------- UPDATE --------------------
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if (req.file) listing.image = req.file.path;
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    console.error("Update Listing Error:", e);
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// -------------------- DELETE --------------------
module.exports.destroyListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (e) {
    console.error("Delete Listing Error:", e);
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
};
