import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;