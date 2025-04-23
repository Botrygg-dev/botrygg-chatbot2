import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Ingen fråga angiven." });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du är en trevlig och hjälpsam kundtjänstassistent för Botrygg. Svara tydligt och korrekt.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = response.data.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    return res.status(500).json({ reply: "Kunde inte hämta svar från GPT." });
  }
}
