import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import Reservation from "../models/Reservation.js";
import Book from "../models/Book.js";

const router = express.Router();

// GET /api/reservations (my reservations)
router.get("/", auth, async (req, res) => {
  try {
    const items = await Reservation.find({ userId: req.user.id })
      .populate("bookId")
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reservations  { bookId }
router.post("/", auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Valid bookId is required" });
    }

    // First try to reserve a copy atomically (decrement if available > 0)
    const bookReserved = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );

    let status = "WAITING";
    let position = 0;

    if (bookReserved) {
      status = "ACTIVE";
    } else {
      // If no copies, put into waiting queue: position = count of waiting + 1
      const waitingCount = await Reservation.countDocuments({
        bookId,
        status: "WAITING",
      });
      position = waitingCount + 1;
    }

    const reservation = await Reservation.create({
      userId: req.user.id,
      bookId,
      status,
      position,
    });

    res.status(201).json(reservation);
  } catch (err) {
    // duplicate active/waiting reservation
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already reserved or waiting for this book" });
    }
    res.status(500).json({ message: err.message });
  }
});

///api/reservations/:id/cancel
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    if (reservation.status === "CANCELLED") {
      return res.status(400).json({ message: "Already cancelled" });
    }
    if (reservation.status === "COMPLETED") {
      return res.status(400).json({ message: "Already completed" });
    }

    const wasActive = reservation.status === "ACTIVE";

    reservation.status = "CANCELLED";
    await reservation.save();

    // If user had an active copy, restore availableCopies
    if (wasActive) {
      await Book.findByIdAndUpdate(reservation.bookId, { $inc: { availableCopies: 1 } });

      // Promote earliest waiting to ACTIVE
      const next = await Reservation.findOneAndUpdate(
        { bookId: reservation.bookId, status: "WAITING" },
        { status: "ACTIVE", position: 0 },
        { sort: { createdAt: 1 }, new: true }
      );

      // If someone promoted, consume the copy again
      if (next) {
        await Book.findByIdAndUpdate(reservation.bookId, { $inc: { availableCopies: -1 } });
      }
    }

    res.status(200).json({ message: "Cancelled" });
  } catch (err) {
    res.status(400).json({ message: "Invalid reservation id" });
  }
});

///api/reservations/:id/complete
router.patch("/:id/complete", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    // only ACTIVE can complete
    if (reservation.status !== "ACTIVE") {
      return res.status(400).json({ message: "Only ACTIVE reservations can be completed" });
    }

    reservation.status = "COMPLETED";
    await reservation.save();

    //Return book copy
    await Book.findByIdAndUpdate(reservation.bookId, { $inc: { availableCopies: 1 } });

    //Promote earliest waiting to ACTIVE (if any)
    const next = await Reservation.findOneAndUpdate(
      { bookId: reservation.bookId, status: "WAITING" },
      { status: "ACTIVE", position: 0 },
      { sort: { createdAt: 1 }, new: true }
    );

    //If someone promoted, consume the copy again
    if (next) {
      await Book.findByIdAndUpdate(reservation.bookId, { $inc: { availableCopies: -1 } });
    }

    res.status(200).json({ message: "Completed" });
  } catch (err) {
    res.status(400).json({ message: "Invalid reservation id" });
  }
});

export default router;