import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useFood } from "../context/FoodDataContext";
import { Send } from "lucide-react";


function Chat() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, addMessageFromAI, isDataLoading } = useFood();
  const scrollRef = useRef(null);

  // Effect to automatically scroll to the bottom of the chat on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (!inputMessage.trim()) return;
    addMessageFromAI(inputMessage);
    setInputMessage(""); // Clear input after sending
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isDataLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full h-full bg-primary rounded-xl flex flex-col relative overflow-hidden">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((item, idx) => (
            <div
              key={idx}
              className={`flex ${
                item.who === "server" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-4 rounded-lg max-w-lg ${
                  item.who === "server"
                    ? "bg-box text-text"
                    : "bg-accent text-white"
                }`}
              >
                {/* Render markdown for insights, a spinner for thinking, or plain text */}
                {item.isInsight ? (
                  <ReactMarkdown
                    components={{
                      h3: ({ ...props }) => (
                        <h3
                          className="text-xl font-semibold mt-4 mb-2"
                          {...props}
                        />
                      ),
                      p: ({ ...props }) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc list-inside mb-4" {...props} />
                      ),
                      li: ({ ...props }) => <li className="mb-2" {...props} />,
                    }}
                  >
                    {item.text}
                  </ReactMarkdown>
                ) : item.id ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white/50"></div>
                    <span>{item.text}</span>
                  </div>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>{item.text}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-primary border-t border-input">
        <div className="flex items-center gap-4">
          <input
            onKeyDown={handleKeyPress}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            type="text"
            className="text-text bg-input w-full border-none outline-none rounded-xl p-4"
            placeholder="Log your meal, e.g., 'I had a chicken salad and a glass of water for lunch'"
            disabled={isDataLoading}
          />
          <button
            disabled={isDataLoading}
            onClick={handleSubmit}
            className="text-text bg-accent p-4 rounded-xl hover:bg-accent/80 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
