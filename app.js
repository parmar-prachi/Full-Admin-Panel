const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const connectDB = require("./config/db");

const dashboardRoute = require("./routes/dashboardRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadDir = path.join(__dirname, "uploads/users");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Home Route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Routes
app.use("/", authRoute);
app.use("/", dashboardRoute);
app.use("/users", userRoute);

// 404
app.use((req, res) => {
    res.status(404).send("404 Page Not Found");
});

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});