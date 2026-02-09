const Listing = require("../models/listing");

// -------------------- LIST ALL LISTINGS (WITH SEARCH, FILTER, SORT, PAGINATION) --------------------
module.exports.index = async (req, res) => {
  try {
    let { search, filter, sort, page } = req.query;
    const ITEMS_PER_PAGE = 6;
    page = parseInt(page) || 1;

    let query = {};

    // SEARCH
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { location: regex },
        { country: regex }
      ];
    }

    // FILTER
    if (filter && filter.trim() !== "") {
      query.type = filter; // assuming each listing has a 'type' field for filters
    }

    // COUNT TOTAL
    const totalListings = await Listing.countDocuments(query);

    // SORT
    let sortOption = {};
    if (sort === "price-low") sortOption.price = 1;
    else if (sort === "price-high") sortOption.price = -1;
    else if (sort === "trending") sortOption.createdAt = -1; // example trending logic: latest

    // FETCH PAGINATED RESULTS
    const allListings = await Listing.find(query)
      .sort(sortOption)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("owner");

    const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);
    const currentPage = page;

    res.render("listings/index.ejs", {
      allListings,
      search: search || "",
      filter: filter || "",
      sort: sort || "",
      currentPage,
      totalPages
    });

  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to load listings");
    res.redirect("/");
  }
};
