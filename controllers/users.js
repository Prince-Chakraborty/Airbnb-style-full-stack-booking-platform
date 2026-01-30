const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1️⃣ Backend Gmail validation
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      req.flash("error", "Please use a valid Gmail address.");
      return res.redirect("/signup");
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered. Please login.");
      return res.redirect("/signup");
    }

    // 3️⃣ Create new user
    const newUser = new User({ email, username });
    await User.register(newUser, password);

    // 4️⃣ Do NOT auto-login
    req.flash("success", "Signup successful! Please login to continue.");
    res.redirect("/login"); // send user to login page
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginForm = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  const redirectUrl = req.session.returnTo || "/listings"; 
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};


module.exports.deleteForm = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
