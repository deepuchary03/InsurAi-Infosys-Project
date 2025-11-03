import React, { useState, useEffect, useRef } from "react";
import { chatAPI } from "../services/api";
import "./AiAssistant.css";

function AiAssistant({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const scrollRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  // Auto-scroll chat window
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Send message to backend
  const sendMessage = async (isVoice = false) => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    const messageText = input;
    setInput("");
    setLoading(true);

    try {
      // Enhanced debug logging
      console.log("=== VOICE BOOKING DEBUG ===");
      console.log("User object:", user);
      console.log("User ID:", user?.id);
      console.log("User keys:", user ? Object.keys(user) : "No user object");
      console.log("Is voice:", isVoice);
      console.log("Message text:", messageText);
      console.log("Sending userId:", user?.id);

      const resp = isVoice
        ? await chatAPI.sendVoiceMessage(messageText, user?.id)
        : await chatAPI.sendMessage(messageText);

      console.log("API Response:", resp.data);
      const reply = resp.data?.reply || resp.data?.message || "(no response)";
      setMessages((m) => [...m, { from: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          from: "assistant",
          text: "Error: " + (err.response?.data?.message || err.message || err),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  // Send voice message
  const sendVoiceMessage = async () => {
    if (!input.trim()) return;
    await sendMessage(true);
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
                <div>
                  Ask me about policies, claims, plans, or booking agents.
                </div>
                <div
                  style={{ fontSize: "12px", marginTop: "10px", color: "#888" }}
                >
                  <strong>Voice Commands:</strong>
                  <br />
                  • "Book appointment with Dr. Priya tomorrow at 2 PM"
                  <br />
                  • "I want to meet a life insurance agent"
                  <br />• "Schedule appointment with health insurance
                  specialist"
                </div>
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
              placeholder="Ask a question or say 'Book appointment with...' 🎤"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="input-buttons">
              {recognition && (
                <button
                  className={`btn voice-btn ${isListening ? "listening" : ""}`}
                  onClick={startListening}
                  disabled={loading || isListening}
                  title="Voice Input"
                >
                  🎤
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => sendMessage()}
                disabled={loading}
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiAssistant;
