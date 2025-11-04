import React, { useState } from "react";
import "./App.css";

function App() {
  // Chat messages
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I’m your HealthBot AI. Tell me your symptoms (e.g., 'I have fever and headache'), and I’ll suggest possible conditions.",
    },
  ]);
  const [input, setInput] = useState("");

  // Disclaimer modal visibility
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Show animated typing indicator
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "typing...", typing: true },
      ]);

      // Send user input to backend
      const response = await fetch("https://healthbot-ai-wqn7.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const result = await response.json();

      // Interpret response
      let diagnosis = result.prediction;
      if (diagnosis.toLowerCase() === "healthy") {
        diagnosis = "No major symptoms detected. You seem fine 😊";
      }

      // Replace typing indicator with result
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { sender: "bot", text: `🤖 ${diagnosis}` },
        ]);
      }, 1200);

      setInput("");
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = {
        sender: "bot",
        text: "⚠️ Sorry, I couldn’t connect to the server.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // 🩺 Popup disclaimer modal (appears on first load)
  if (showDisclaimer) {
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>⚠️ Medical Disclaimer</h3>
          <p>
            This chatbot provides general information based on symptoms.
            It is <strong>not</strong> a medical diagnostic tool.
            Always consult a qualified healthcare professional for accurate medical advice.
          </p>
          <button onClick={() => setShowDisclaimer(false)}>I Understand</button>
        </div>
      </div>
    );
  }

  // 🧠 Main chat interface
  return (
    <div className="chat-container">
      <header className="app-header">
        🩺 HealthBot AI <span>by Priyanshu Sharma</span>
      </header>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.typing ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Footer Disclaimer */}
      <p className="disclaimer">
        ⚠️ <strong>Note:</strong> HealthBot AI is for informational purposes only.
        It is not a substitute for professional medical consultation.
      </p>

      {/* Developer Credit */}
      <div className="credit">
        Built with ❤️ by <span>Priyanshu Sharma</span>
      </div>
    </div>
  );
}

export default App;
