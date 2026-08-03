import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3200;

console.log("PORT", PORT);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" })); // Allows you to parse the body of the request.
app.use(cookieParser()); // Allows you to parse access and refresh tokens.

app.get("/test", (req, res) => {
  res.json({
    message: "Test ok!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost/${PORT}`);
  connectDB();
});
