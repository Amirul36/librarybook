import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  },
  { timestamps: true }
);

// prevent duplicates
FavoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("Favorite", FavoriteSchema);