const express = require('express');
const { registerUser } = require('../controller/authController');
const { loginUser } = require('../controller/authController');
const { logoutUser } = require('../controller/authController');
const userModel = require('../models/user-model');
const router = express.Router();


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

module.exports = router;