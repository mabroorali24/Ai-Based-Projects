import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { messages, subject } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const systemPrompt = `You are an expert study tutor${subject ? ` specializing in ${subject}` : ""}.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          max_tokens: 800,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error");
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to get tutor response" });
  }
});

export default router;