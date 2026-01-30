const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { alreadyLoggedIn } = require("../middleware");

// -------------------- SIGNUP --------------------
router.get("/signup", alreadyLoggedIn, users.renderSignup);
router.post("/signup", users.signup);

// -------------------- LOGIN --------------------
router.get("/login",users.renderLoginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    // After login, redirect to originally requested page OR /listings
    const redirectUrl = res.locals.returnTo || "/listings";
    delete req.session.returnTo;
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect(redirectUrl);

  }
);

// -------------------- LOGOUT --------------------
router.get("/logout", users.deleteForm);

module.exports = router;
