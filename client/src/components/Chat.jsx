import React, { useState, useRef, useEffect } from "react";
import Notification from "./Notification";
import ReactMarkdown from "react-markdown";

function Chat({ messages, setMessages, model, update, setFoodDataVersion }) {
  const fileRef = useRef(null);

  const [inputMessage, setInputMessage] = useState("");

  const [isLoading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    const diva = scrollRef.current;
    if (diva) {
      diva.scrollTop = diva.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, update]);

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;

    setLoading(true);

    const userMessage = { who: "client", text: inputMessage };
    setMessages((current) => [...current, userMessage]);
    setInputMessage(""); // Clear input after sending

    try {
      // Send the message to your Django backend
      const response = await fetch("http://127.0.0.1:8000/api/food-entry-ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const newEntries = await response.json();
      console.log("AI response (newEntries):", newEntries);

      if (newEntries) {
        const aiText = newEntries
          .map(
            (entry) =>
              `Added: ${entry.food_name} (${entry.calories} kcal for ${entry.consumed_at})`
          )
          .join("\n");
        console.log("AI message to display:", aiText);
        setMessages((current) => [...current, { who: "server", text: aiText }]);
      }

      // Trigger a refresh in Home.jsx for the sidebar
      setFoodDataVersion((v) => v + 1);
    } catch (err) {
      console.error("Failed to reach backend:", err);
      setMessages((current) => [
        ...current,
        {
          who: "server",
          text: "Sorry, I couldn't connect to the server. Please check if it's running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      //   setFile(null);
      //   setShow("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  if (!messages || !Array.isArray(messages)) return null;

  return (
    <div className="w-full bg-primary lg:ml-[20px] ml-0 rounded-xl hh my-[48px] relative px-[20px] overflow-x-hidden">
      {isLoading && <Notification />}
      <div
        ref={scrollRef}
        className="w-full absolute bottom-0 justify-between pb-[100px] pr-10 overflow-y-scroll h-full sh"
      >
        {messages?.filter(Boolean).map((item, idx) => (
          <div
            key={idx}
            className={
              item.who === "server"
                ? "w-full flex flex-col items-start"
                : "w-full flex flex-col  items-end"
            }
          >
            <div
              className={
                item.who === "server"
                  ? "text-text bg-box p-4 rounded-lg my-2 lg:w-6/12 w-full float-right"
                  : "text-text lg:bg-box bg-[#36363a] p-4 rounded-lg my-2 lg:w-6/12 w-full float-right"
              }
            >
              {item.image && (
                <div className="w-full mb-4 border-b-2 border-text pb-4">
                  <img src={item.image} className="w-3/12" alt="content" />
                </div>
              )}
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
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white/50 mr-3"></div>
                  <span>{item.text}</span>
                </div>
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>{item.text}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-[0px] wc pb-[20px] flex items-center gap-x-4 bg-primary">
        <input
          onKeyDown={handleKeyPress}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          type="text"
          className="text-text bg-input wc border-none outline-none rounded-xl p-4"
          placeholder="Let the magic begin, Ask a question"
        />
        <input
          ref={fileRef}
          //   onChange={handleFileChange}
          type="file"
          className="hidden"
          id="foc"
        />
        {model.includesImage && (
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            className="text-text bg-input p-4 rounded-xl hover:bg-[#36363a]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
          </button>
        )}
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="text-text bg-input p-4 rounded-xl hover:bg-[#36363a] mr-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Chat;
