// src/routes/auth.js
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// Debug log
console.log("Loaded register:", typeof register);
console.log("Loaded login:", typeof login);
console.log("AUTH PATH TEST:", __dirname + "/../controllers/authController.js");
console.log("FILE EXISTS:", require('fs').existsSync(__dirname + "/../controllers/authController.js"));


router.post("/register", register);
router.post("/login", login);

module.exports = router;
