import express from "express";
import mongoose from "mongoose";
import Favorite from "../models/Favorite.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/favorites  (my favorites)
router.get("/", auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate("bookId")
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/favorites  { bookId }
router.post("/", auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Valid bookId is required" });
    }

    const fav = await Favorite.create({
      userId: req.user.id,
      bookId,
    });

    res.status(201).json(fav);
  } catch (err) {
    // duplicate favorite
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already favorited" });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/favorites/:id  (delete favorite record)
router.delete("/:id", auth, async (req, res) => {
  try {
    const fav = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!fav) return res.status(404).json({ message: "Favorite not found" });

    res.status(200).json({ message: "Favorite removed" });
  } catch (err) {
    res.status(400).json({ message: "Invalid favorite id" });
  }
});

export default router;