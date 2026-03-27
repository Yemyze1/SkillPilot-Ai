export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are SkillPilot AI, a helpful learning and career assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, no response from AI.";

    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
