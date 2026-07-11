"use client";

import { useState, useRef, FormEvent, useEffect } from "react";

export default function MyPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ошибка, попробуй ещё раз." }]);
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" }), 100);
  }

  return (
    <div
      style={{
        background: "radial-gradient(circle at center, #0a1628 0%, #02040a 100%)",
        color: "#00ffcc",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "28px", letterSpacing: "6px", textAlign: "center", textShadow: "0 0 20px #00ffcc33" }}>
        J.A.R.V.I.S.
      </h1>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "20px",
          background: "rgba(0, 255, 204, 0.05)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(0, 255, 204, 0.15)",
          backdropFilter: "blur(4px)",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#00ffcc77", paddingTop: "40px" }}>
            💬 Начни разговор
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: "16px",
                background: m.role === "user" ? "rgba(0, 255, 204, 0.15)" : "rgba(255, 255, 255, 0.05)",
                border: m.role === "user" ? "1px solid rgba(0, 255, 204, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                color: m.role === "user" ? "#ccffff" : "#ccddff",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ color: "#00ffcc66", fontStyle: "italic" }}>Думаю...</div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите вопрос..."
          style={{
            flex: 1,
            padding: "14px 20px",
            borderRadius: "30px",
            border: "1px solid rgba(0, 255, 204, 0.3)",
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            fontSize: "16px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "14px 28px",
            borderRadius: "30px",
            border: "none",
            background: "rgba(0, 255, 204, 0.2)",
            color: "#00ffcc",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
            border: "1px solid rgba(0, 255, 204, 0.3)",
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
}
