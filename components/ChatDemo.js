// redep
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logo from '../public/logga.png';
import bossePic from '../public/94477fa3-63e8-4d8a-a4d8-d5d490916ecc.png';

export default function ChatDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hej! Hur kan jag hjälpa dig idag?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setIsTyping(true);

    const userMessage = { from: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { from: "system", text: "Bosse skriver..." }]);

    try {
      const formattedForAPI = updatedMessages
        .filter(m => m.from !== 'system')
        .map(m => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text
        }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedForAPI })
      });

      const text = await res.text();
      console.log("Rått svar från API:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Kunde inte tolka JSON:", e.message);
        setMessages(prev => [...prev.filter(m => m.text !== "Bosse skriver..."), { from: "bot", text: "Kunde inte läsa svaret från servern." }]);
        return;
      }

      setMessages(prev => [...prev.filter(m => m.text !== "Bosse skriver..."), { from: "bot", text: data.reply || "(Tomt svar från API)" }]);
    } catch (error) {
      console.error("Fetch-fel:", error);
      setMessages(prev => [...prev.filter(m => m.text !== "Bosse skriver..."), { from: "bot", text: "Fel vid kontakt med servern." }]);
    } finally {
      setLoading(false);
      setIsTyping(false);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', border: '1px solid #ddd', borderRadius: 10, overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <style>
        {`
          @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
          .dot-flash span {
            animation: blink 1.4s infinite both;
          }
          .dot-flash span:nth-child(2) {
            animation-delay: 0.2s;
          }
          .dot-flash span:nth-child(3) {
            animation-delay: 0.4s;
          }
        `}
      </style>
      <div style={{ background: '#aa1e2c', color: 'white', padding: 10, display: 'flex', alignItems: 'center' }}>
        <Image src={logo} alt="Botrygg logotyp" width={30} height={30} />
        <h2 style={{ marginLeft: 10, fontSize: 18 }}>Chatta med Bosse 🤖</h2>
      </div>
      <div style={{ height: 300, overflowY: 'scroll', background: '#f9f9f9', padding: 10 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 10
            }}
          >
            <div
              style={{
                background: msg.from === 'user' ? '#007aff' : '#e5e5ea',
                color: msg.from === 'user' ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: 20,
                maxWidth: '70%',
                fontSize: 14
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ textAlign: 'left', fontStyle: 'italic', color: '#999', marginLeft: 10 }}>
            Bosse skriver <span className="dot-flash"><span>.</span><span>.</span><span>.</span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #eee', background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv din fråga..."
          style={{ flex: 1, padding: 8, borderRadius: 20, border: '1px solid #ccc' }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ marginLeft: 10, padding: '8px 16px', background: '#aa1e2c', color: 'white', border: 'none', borderRadius: 20 }}
        >
          {loading ? "Skickar..." : "Skicka"}
        </button>
      </div>
    </div>
  );
}
