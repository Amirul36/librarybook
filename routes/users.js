import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

//get /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/me/interests", auth, async (req, res) => {
  try {
    const { interestCategoryIds = [] } = req.body;

    if (!Array.isArray(interestCategoryIds)) {
      return res.status(400).json({ message: "interestCategoryIds must be an array" });
    }
    if (interestCategoryIds.length < 1) {
      return res.status(400).json({ message: "Select at least 1 category" });
    }
    if (interestCategoryIds.length > 5) {
      return res.status(400).json({ message: "Select up to 5 categories" });
    }
    if (!interestCategoryIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Invalid category id found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { interests: interestCategoryIds, hasOnboarded: true },
      { new: true }
    ).select("-passwordHash");

    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;