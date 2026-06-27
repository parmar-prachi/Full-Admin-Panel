const User = require("../models/User");

exports.dashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: "Active" });
        const inactiveUsers = await User.countDocuments({ status: "Inactive" });


        const monthlyData = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const maleUsers = await User.countDocuments({ gender: "Male" });
        const femaleUsers = await User.countDocuments({ gender: "Female" });


        res.render("dashboard", {
            totalUsers,
            activeUsers,
            inactiveUsers,
            monthlyData,
            maleUsers,
            femaleUsers
        });

    } catch (err) {
        console.error("Dashboard calculation error:", err);

        res.render("dashboard", {
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            inactiveUsers: inactiveUsers,
            monthlyData: [],
            maleUsers: maleUsers,
            femaleUsers: femaleUsers
        });
    }
};