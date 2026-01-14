import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {type: String, require: true, trim: true, unique: true },
        description: {type: String, trim: true, default: ""},
    },
    {timestamps: true}
);

export default mongoose.model("Category", CategorySchema)