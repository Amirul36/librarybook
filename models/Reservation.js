import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },

    status: {
      type: String,
      enum: ["ACTIVE", "WAITING", "CANCELLED", "COMPLETED"],
      required: true,
    },

    // Queue position (MVP: we store a number for display; promotion sets it to 0)
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent the same user from having multiple ACTIVE/WAITING reservations for the same book
ReservationSchema.index(
  { userId: 1, bookId: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["ACTIVE", "WAITING"] } } }
);

export default mongoose.model("Reservation", ReservationSchema);