import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categories.js";
import booksRouter from "./routes/books.js";
import authRouter from "./routes/auth.js";
import favoritesRouter from "./routes/favorites.js";
import reservationsRouter from "./routes/reservations.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/categories", categoriesRouter);
app.use("/api/books", booksRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;