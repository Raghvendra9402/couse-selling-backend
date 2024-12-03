const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../db");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    res.send({ message: "user already exists" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.create({
    username: username,
    email: email,
    password: hashedPassword,
  });
  res.send({ message: "user created Successfully" });
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Sign-in successful",
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  userRouter,
};
