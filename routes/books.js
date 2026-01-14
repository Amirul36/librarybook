import express from "express";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/*sorting stuff for search*/
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      categoryId = "",
      available = "",
      sort = "title",
    } = req.query;

    const filter = {};

    // Filter by category
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryIds = categoryId; // matches if array contains this id
    }

    // Filter by availability
    if (available === "true") {
      filter.availableCopies = { $gt: 0 };
    }

    // Text search on title/author
    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const sortMap = {
      title: { title: 1 },
      author: { author: 1 },
      newest: { createdAt: -1 },
    };

    const books = await Book.find(filter)
      .populate("categoryIds", "name")
      .sort(sortMap[sort] || sortMap.title);

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//gets recommened book based on user interest
router.get("/recommended", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const interests = user?.interests || [];

    if (interests.length === 0) return res.status(200).json([]);

    const books = await Book.find({ categoryIds: { $in: interests } })
      .populate("categoryIds", "name")
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/*gets book api id*/
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const book = await Book.findById(req.params.id).populate(
      "categoryIds",
      "name"
    );

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;