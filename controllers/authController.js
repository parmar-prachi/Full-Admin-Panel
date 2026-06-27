const bcrypt = require("bcryptjs");
const User = require("../models/User");

// REGISTER PAGE
exports.registerPage = (req, res) => {
    res.render("signup");
};

// REGISTER :

exports.register = async (req, res) => {
    try {
    
        const emailInput = req.body.email ? req.body.email.trim().toLowerCase() : "";
        const usernameInput = req.body.username ? req.body.username.trim() : "";

        const existingEmail = await User.findOne({ email: emailInput });
        if (existingEmail) {
            return res.send("Email already exists ❌");
        }

        const existingUsername = await User.findOne({ username: usernameInput });
        if (existingUsername) {
            return res.send("Username already taken ❌");
        }

        // Hash the plain password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: usernameInput,
            email: emailInput,
            password: hashedPassword
        });

        return res.redirect("/login");

    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

// LOGIN PAGE

exports.loginPage = (req, res) => {
    res.render("login");
};

// LOGIN USER
exports.login = async (req, res) => {
    try {
        // Sanitize the input to match how it's stored
        const emailInput = req.body.email ? req.body.email.trim().toLowerCase() : "";
        const passwordInput = req.body.password;

        console.log("Looking for sanitized email:", emailInput);

        const user = await User.findOne({ email: emailInput });

        if (!user) {
            return res.send("User not found ❌");
        }

        console.log("Email:", emailInput);
        console.log("Entered Password:", passwordInput);
        console.log("Stored Hash:", user.password);

        const match = await bcrypt.compare(passwordInput, user.password);

        console.log("Password Match:", match);

        if (!match) {
            return res.send("Wrong password ❌");
        }

        res.cookie("user", user._id, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

// LOGOUT
exports.logout = (req, res) => { 
    res.clearCookie("user");
    return res.redirect("/login");
};