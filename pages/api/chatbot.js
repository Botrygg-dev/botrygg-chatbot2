import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Missing message in request body." });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Du är en vänlig kundtjänstmedarbetare på Botrygg som hjälper till med hyresfrågor." },
        { role: "user", content: message }
      ]
    });

    const reply = chatCompletion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ reply: "Fel vid kontakt med OpenAI." });
  }
}
