//trigger re
import { useState } from "react";

export default function ChatDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hej! Hur kan jag hjälpa dig idag?" }
  ]);

  const sendMessage = async () => {
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages([...messages, { from: "user", text: input }, { from: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "bot" ? "left" : "right" }}>
            <p><strong>{msg.from === "bot" ? "Bot" : "Du"}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Skriv din fråga..."
        style={{ width: "100%", marginTop: 10 }}
      />
      <button onClick={sendMessage} style={{ marginTop: 10 }}>Skicka</button>
    </div>
  );
}
