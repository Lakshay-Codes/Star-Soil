import express from "express";
import UserModel from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticationMiddleware } from "../middleware/index.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    await UserModel.create(req.body);
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    await UserModel.findByIdAndUpdate(user._id, { updatedAt: new Date() });

    return res
      .status(200)
      .json({ message: "Logged in successfully", token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/current-user", authenticationMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("-password");
    await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
    return res
      .status(200)
      .json({ message: "Profile fetched successfully", user: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-all", authenticationMiddleware, async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });
    await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });
    return res.status(200).json({
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-stats", authenticationMiddleware, async (req, res) => {
  try {
    const totalPayments = await PaymentModel.countDocuments({
      user: req.user.userId,
    });
    const totalAmount = await PaymentModel.aggregate([
      { $match: { user: req.user.userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const planetsContributed = await PaymentModel.distinct("planet", {
      user: req.user.userId,
    }).length;

    await UserModel.findByIdAndUpdate(req.user.userId, { updatedAt: new Date() });

    return res.status(200).json({
      totalPayments,
      totalAmount: totalAmount[0]?.total || 0,
      planetsContributed,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/update-password", authenticationMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid old password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(userId, { 
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
