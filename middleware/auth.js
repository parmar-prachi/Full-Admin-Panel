const User = require("../models/User"); 

module.exports = async (req, res, next) => {
    console.log(req.cookies);

    try {
       
        if (!req.cookies.user) {
            console.log("No user cookie found ❌");
            return res.redirect("/login");
        }

        
        const user = await User.findById(req.cookies.user);

        if (!user) {
            console.log("User id in cookie does not exist in DB ❌");
            return res.redirect("/login");
        }

    
        req.user = user;
        next();

    } catch (err) {
        console.error("Middleware Error:", err);
        return res.redirect("/login");
    }
};  