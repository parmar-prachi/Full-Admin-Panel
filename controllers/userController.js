const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "../uploads/users");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}


// ADD USER PAGE

exports.addUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.cookies.user);

        if (!currentUser) {
            return res.redirect("/login");
        }

        res.render("add", {
            user: currentUser   // send logged-in user data
        });

    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
};


// INSERT USER (CREATE NEW USER)

exports.insertUser = async (req, res) => {
    try {

        const userId = req.cookies.user;

        const existingUser = await User.findById(userId);

        // If logged-in user exists → UPDATE instead of CREATE
        if (existingUser) {

            existingUser.firstName = req.body.firstName;
            existingUser.lastName = req.body.lastName;
            existingUser.mobile = req.body.mobile;
            existingUser.gender = req.body.gender;
            existingUser.dob = req.body.dob;
            existingUser.age = req.body.age;
            existingUser.address = req.body.address;
            existingUser.city = req.body.city;
            existingUser.state = req.body.state;
            existingUser.pincode = req.body.pincode;
            existingUser.education = req.body.education;
            existingUser.occupation = req.body.occupation;
            existingUser.hobbies = req.body.hobbies
                ? req.body.hobbies.split(",").map(h => h.trim())
                : [];

            // image update
            if (req.file) {
                if (existingUser.image && existingUser.image !== "default.png") {
                    const imagePath = path.join(__dirname, "../uploads/users", existingUser.image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }

                existingUser.image = req.file.filename;
            }

            await existingUser.save();

            return res.redirect("/dashboard");
        }

        // OTHERWISE → CREATE NEW USER (admin case)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            mobile: req.body.mobile,
            gender: req.body.gender,
            dob: req.body.dob,
            age: req.body.age,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            education: req.body.education,
            occupation: req.body.occupation,
            joiningDate: req.body.joiningDate,
            status: req.body.status,
            hobbies: req.body.hobbies
                ? req.body.hobbies.split(",").map(h => h.trim())
                : [],
            image: req.file ? req.file.filename : "default.png"
        });

        await newUser.save();

        res.redirect("/users");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// VIEW ALL USERS

exports.viewUsers = async (req, res) => {
    try {

        const search = req.query.search || "";

        const users = await User.find({
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });

        res.render("table", { users, search });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// SINGLE USER

exports.getSingleUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.send("User not found");
        }

        res.render("view", { user });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};


// EDIT USER PAGE

exports.editUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.redirect("/users");
        }

        res.render("edit", { user });

    } catch (err) {
        console.log(err);
        res.redirect("/users");
    }
};


// UPDATE USER

exports.updateUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.redirect("/users");
        }


        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;


        user.username = req.body.username || user.username;

        user.gender = req.body.gender || user.gender;
        user.dob = req.body.dob || user.dob;
        user.age = req.body.age || user.age;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.state = req.body.state || user.state;
        user.pincode = req.body.pincode || user.pincode;
        user.education = req.body.education || user.education;
        user.occupation = req.body.occupation || user.occupation;
        user.joiningDate = req.body.joiningDate || user.joiningDate;
        user.status = req.body.status || user.status;


        user.hobbies = req.body.hobbies
            ? req.body.hobbies.split(",").map(h => h.trim())
            : user.hobbies;


        if (req.file) {

            if (user.image && user.image !== "default.png") {
                const imagePath = path.join(
                    __dirname,
                    "../uploads/users",
                    user.image
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            user.image = req.file.filename;
        }

        await user.save();

        res.redirect("/users");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

// DELETE USER

exports.deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.redirect("/users");
        }

        if (user.image && user.image !== "default.png") {

            const imagePath = path.join(
                __dirname,
                "../uploads/users",
                user.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await User.findByIdAndDelete(req.params.id);

        res.redirect("/users");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};