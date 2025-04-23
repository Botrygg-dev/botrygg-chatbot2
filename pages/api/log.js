import fs from "fs";
import path from "path";

const logFile = path.resolve("./public/chat-log.json");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { question, answer, timestamp } = req.body;

  const entry = { question, answer, timestamp };
  const existing = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile)) : [];

  existing.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));

  res.status(200).json({ message: "Loggad" });
}