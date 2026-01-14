import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true, default: "" },

    categoryIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1 && arr.length <= 2,
        message: "A book must have 1 to 2 categories.",
      },
    },

    description: { type: String, trim: true, default: "" },
    coverUrl: { type: String, trim: true, default: "" },
    callNumber: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },

    totalCopies: { type: Number, required: true, min: 0, default: 1 },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
  },
  { timestamps: true }
);

BookSchema.index({ title: "text", author: "text" });

export default mongoose.model("Book", BookSchema);