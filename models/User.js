import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true, unique: true, lowercase: true},
        passwordHash: {type: String, required: true},
        interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
        hasOnboarded: { type: Boolean, default: false },
    },
    {timestamps: true}
);

export default mongoose.model("User", UserSchema);