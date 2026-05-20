import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import chatRoute from "./routes/chat.js";
import flashcardsRoute from "./routes/flashcards.js";
import quizRoute from "./routes/quiz.js";
import summaryRoute from "./routes/summary.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/chat", chatRoute);
app.use("/api/flashcards", flashcardsRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/summary", summaryRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Study Assistant running at http://localhost:${PORT}`);
});
