import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du är en trevlig och hjälpsam kundtjänstassistent för Botrygg. Svara på ett vänligt och tydligt sätt."
        },
        { role: "user", content: message }
      ],
      max_tokens: 500
    });

    const reply = response.data.choices?.[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: "Det uppstod ett fel vid hämtning av svar." });
  }
}