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
            content: "You are a quiz generator. Always respond with valid JSON only — no markdown, no extra text, no code blocks."
          },
          {
            role: "user",
            content: `Generate ${count} multiple-choice quiz questions about: "${topic}".
Return a JSON object like this:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}
"correct" is the 0-based index of the correct option. Vary difficulty.`
          }
        ],
        max_tokens: 1500
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const raw = data.choices[0].message.content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    res.json({ questions: parsed.questions });
  } catch (err) {
    console.error("Quiz error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

export default router;
