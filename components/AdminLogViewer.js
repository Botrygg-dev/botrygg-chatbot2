import { useEffect, useState } from "react";

export default function AdminLogViewer() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch("/chat-log.json")
      .then(res => res.json())
      .then(data => setLogs(data.reverse()));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Loggar</h2>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: 20, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
          <div><strong>Fråga:</strong> {log.question}</div>
          <div><strong>Svar:</strong> {log.answer}</div>
          <div><em>{new Date(log.timestamp).toLocaleString()}</em></div>
        </div>
      ))}
    </div>
  );
}