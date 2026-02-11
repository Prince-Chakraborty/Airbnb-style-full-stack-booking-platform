const User = require("../models/user");

// ---------- SIGNUP ----------
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

// ---------- SIGNUP ----------
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      req.flash("error", "Please use a valid Gmail address.");
      return res.redirect("/signup");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered. Please login.");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    await User.register(newUser, password);

    // ❌ Remove auto-login
    req.flash("success", `Account created! Please login.`);
    res.redirect("/login");   // ✅ Redirect to login page after signup
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


// ---------- LOGIN ----------
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginForm = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  const redirectUrl = req.session.returnTo || "/listings"; 
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// ---------- LOGOUT ----------
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
