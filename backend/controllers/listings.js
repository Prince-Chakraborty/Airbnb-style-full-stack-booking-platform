const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    let { search, filter, sort, page } = req.query;
    const ITEMS_PER_PAGE = 6;
    page = Number(page) || 1;

    let query = {};

    // SEARCH
    if (search && search.trim() !== "") {
      const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapeRegex(search), "i");
      query.$or = [
        { title: regex },
        { location: regex },
        { country: regex }
      ];
    }

    // FILTER (check if 'type' field exists in schema)
    if (filter && filter.trim() !== "" && Listing.schema.path("type")) {
      query.type = filter;
    }

    // COUNT TOTAL
    const totalListings = await Listing.countDocuments(query);

    // SORT
    let sortOption = {};
    if (sort === "price-low") sortOption.price = 1;
    else if (sort === "price-high") sortOption.price = -1;
    else if (sort === "trending") sortOption.createdAt = -1;

    // FETCH PAGINATED RESULTS
    const allListings = await Listing.find(query)
      .sort(sortOption)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("owner");

    const totalPages = Math.ceil(totalListings / ITEMS_PER_PAGE);

    res.render("listings/index.ejs", {
      allListings: allListings || [],
      search: search || "",
      filter: filter || "",
      sort: sort || "",
      currentPage: page,
      totalPages: totalPages || 1
    });

  } catch (e) {
    console.error("Listings Index Error:", e);
    req.flash("error", "Failed to load listings");
    res.redirect("/");
  }
};
