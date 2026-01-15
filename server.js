import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("MongoDB Connection Error:", err.message);
  process.exit(1);
});