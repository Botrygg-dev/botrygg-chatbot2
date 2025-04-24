import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST allowed" });
    return;
  }

  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ message: "Missing message." });
      return;
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4", // eller gpt-3.5-turbo om du vill testa billigare
      messages: [
        {
          role: "system",
          content:
            "Du är en trevlig och tydlig kundtjänstmedarbetare på Botrygg. Hjälp användaren med frågor om hyreslägenheter, parkering, andrahandsuthyrning etc.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ reply: "Fel vid kontakt med GPT." });
  }
}
