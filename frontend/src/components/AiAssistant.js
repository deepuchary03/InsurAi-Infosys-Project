import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "./AiAssistant.css";

function AiAssistant({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const resp = await api.post("/chat", {
        message: userMsg.text,
        role: "user",
      });
      const reply = resp.data?.reply || "(no response)";
      setMessages((m) => [...m, { from: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { from: "assistant", text: "Error: " + (err.message || err) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ai-assistant-widget ${open ? "open" : "closed"}`}>
      {/* Floating toggle button */}
      <div className="assistant-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? "Chat" : "AI"}
      </div>

      {/* Sidebar panel */}
      {open && (
        <div className="ai-assistant card">
          <div className="assistant-header">
            <h3>Ai Chat Bot</h3>
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-window" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="empty">
                Ask me about policies, claims, plans, or booking agents.
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.from}`}>
                <div className="meta">
                  {m.from === "user" ? user.username : "Assistant"}
                </div>
                <div className="text">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiAssistant;
