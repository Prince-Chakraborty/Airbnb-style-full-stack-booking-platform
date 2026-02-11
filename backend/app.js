if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo").default;
const User = require("./models/user");

const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

const app = express();

// -------------------- DATABASE --------------------
const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// -------------------- VIEW ENGINE --------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------- MIDDLEWARE --------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve uploads folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: { secret: process.env.SECRET }
});

store.on("error", e => console.log("SESSION STORE ERROR", e));

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// -------------------- PASSPORT --------------------
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------- FLASH & CURRENT USER --------------------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// -------------------- ROUTES --------------------
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => res.redirect("/listings"));

// -------------------- SERVER --------------------
app.listen(8080, () => console.log("Server running on port 8080"));
