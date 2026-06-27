const router = require("express").Router();
const auth = require("../controllers/authController");

// register
router.get("/signup", auth.registerPage);
router.post("/register", auth.register);

// login
router.get("/login", auth.loginPage);
router.post("/login", auth.login);

// logout
router.get("/logout", auth.logout);

module.exports = router;