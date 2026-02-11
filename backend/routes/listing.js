const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");


// ==================== INDEX ====================
router.get(
  "/",
  isLoggedIn,
  listingController.index
);


// ==================== NEW ====================
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);


// ==================== CREATE ====================
router.post(
  "/",
  isLoggedIn,
  upload.array("images", 5),   // ✅ Allow up to 5 images
  validateListing,
  listingController.createListing
);


// ==================== SHOW ====================
router.get(
  "/:id",
  isLoggedIn,
  listingController.showListings
);


// ==================== EDIT ====================
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  listingController.renderEditForm
);


// ==================== UPDATE ====================
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.array("images", 5),   // ✅ Multiple images on update
  validateListing,
  listingController.updateListing
);


// ==================== DELETE ====================
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  listingController.destroyListing
);


module.exports = router;
