import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 20) {
    return res.status(400).json({ error: "text is required (minimum 20 characters)" });
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
            content: `You are a study notes assistant. Summarize notes clearly and concisely for students.
Structure your summary with:
- A 2-3 sentence overview
- Key concepts as bullet points
- Any important terms or definitions
- A 1-sentence takeaway

Keep it scannable and easy to review before an exam.`
          },
          {
            role: "user",
            content: `Summarize these study notes:\n\n${text}`
          }
        ],
        max_tokens: 600
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ summary: data.choices[0].message.content });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to summarize notes" });
  }
});

export default router;
