import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { topic, count = 5 } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a flashcard generator. Always respond with valid JSON only — no markdown, no extra text, no code blocks."
          },
          {
            role: "user",
            content: `Generate ${count} flashcards for the topic: "${topic}".
Return a JSON object like this:
{ "cards": [ { "front": "question or term", "back": "answer or definition" } ] }
Make the cards educational, concise, and varied in difficulty.`
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const raw = data.choices[0].message.content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    const cards = parsed.cards || parsed.flashcards || Object.values(parsed)[0];

    res.json({ flashcards: cards });
  } catch (err) {
    console.error("Flashcards error:", err);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

export default router;
