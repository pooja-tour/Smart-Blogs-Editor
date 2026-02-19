const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

mongoose.connect("mongodb://127.0.0.1:27017/smartblog")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const Blog = require("./models/Blog");
const User = require("./models/User");

let loggedInUser = null; // simple session (basic demo)

// ================= AUTH =================

// Register
// ================= AUTH =================

// Register
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.json({ message: "Account Created Successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Login
app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
        return res.json({ message: "Invalid Credentials" });
    }

    loggedInUser = user.username;

    res.json({ message: "Login Successful" });
});

// Logout
app.get("/logout", (req, res) => {
    loggedInUser = null;
    res.json({ message: "Logged Out" });
});

// Check Login
app.get("/check-login", (req, res) => {
    if (loggedInUser) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

// ================= BLOG ROUTES =================

app.post("/save", async (req, res) => {

    if (!loggedInUser) {
        return res.json({ message: "Please login first" });
    }

    const { id, title, content } = req.body;

    if (id) {
        await Blog.findByIdAndUpdate(id, { title, content });
        return res.json({ message: "Blog Updated" });
    }

    const newBlog = new Blog({ title, content });
    await newBlog.save();

    res.json({ message: "Blog Created" });
});

app.get("/blogs", async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
});

app.get("/blog/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
});

app.delete("/delete/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog Deleted" });
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});