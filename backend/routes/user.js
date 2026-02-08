const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { alreadyLoggedIn } = require("../middleware");

// -------------------- SIGNUP --------------------
router.get("/signup", alreadyLoggedIn, users.renderSignup);
router.post("/signup", users.signup);

// -------------------- LOGIN --------------------
router.get("/login", alreadyLoggedIn, users.renderLoginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect(redirectUrl);
  }
);

// -------------------- LOGOUT --------------------
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Successfully logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
