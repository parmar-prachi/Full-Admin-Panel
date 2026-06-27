const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const userController = require("../controllers/userController");

// Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/users"));
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({

    storage

});

// Routes


router.get("/", userController.viewUsers);

router.get("/add", userController.addUser);

router.post(

    "/add",

    upload.single("image"),

    userController.insertUser

);
// Edit User Page
router.get("/edit/:id", userController.editUser);

// Update User
router.post(
    "/update/:id",
    upload.single("image"),
    userController.updateUser
);

router.get("/:id", userController.getSingleUser)

router.get("/delete/:id", userController.deleteUser);

module.exports = router;