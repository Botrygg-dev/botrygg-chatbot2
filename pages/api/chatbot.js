import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST allowed" });
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ message: "Missing message in request body." });
    return;
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Du är en trevlig och tydlig kundtjänstmedarbetare på Botrygg." },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = response.data.choices?.[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ reply: "Fel vid kontakt med OpenAI." });
  }
}
