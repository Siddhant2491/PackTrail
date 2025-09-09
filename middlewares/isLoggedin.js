const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash("Error", "You must be logged in First.");
        return res.redirect("/");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(data.id).select("-password");

        if (!user) throw new Error("User not found");

        req.user = user;
        next();
    } catch (err) {
        console.error("User auth failed:", err.message);
        return next(err); 
    }
};

const ownerLoggedIn = async (req, res, next) => {
    const token = req.cookies.ownerToken;

    if (!token) {
        req.flash("Error", "You must be logged in as Owner.");
        return res.redirect("/");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const owner = await ownerModel.findById(data.id).select("-password");

        if (!owner) throw new Error("Owner not found");

        req.user = owner;
        next();
    } catch (err) {
        console.error("Owner auth failed:", err.message);
        return next(err); // continue to next middleware in allowEither
    }
};

module.exports = {
    userLoggedIn,
    ownerLoggedIn,
};
