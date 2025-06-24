import React, { useState } from "react";
import Popup from "./Popup";
import BreakdownView from "./Bar/BreakdownView";
import HistoryView from "./Bar/HistoryView";
import { Button } from "./ui/button";
import { Lightbulb } from "lucide-react";
import InsightPopup from "./InsightPopup";

function Bar({
  setOpen,
  isOpen,
  update,
  setUpdate,
  total,
  isLoading,
  foodEntries,
  historicalTotals,
  selectedDate,
  setSelectedDate,
  setMessages,
}) {
  const [popup, setPopup] = useState(false);
  const [insightPopup, setInsightPopup] = useState({
    isOpen: false,
    content: "",
    isLoading: false,
  });
  const [viewMode, setViewMode] = useState("breakdown");

  const fetchInsight = async () => {
    const loadingMessage = {
      who: "server",
      text: "Your personal AI Health Coach is analyzing your day...",
      id: Date.now(), // Unique ID for the loading message
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await fetch(
        `http://localhost:8000/api/health-insight/?date=${dateStr}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }
      const data = await response.json();

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessage.id),
        { who: "server", text: data.insight, isInsight: true },
      ]);
    } catch (error) {
      console.error("Error fetching insight:", error);
      const errorMessage = "Sorry, I couldn't fetch your health insight.";
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessage.id),
        { who: "server", text: errorMessage },
      ]);
    }
  };

  return (
    <div className="w-[22rem] hh lg:bg-main bg-primary rounded-xl relative flex flex-col">
      <Popup
        setUpdate={setUpdate}
        update={update}
        isOpen={popup}
        setOpen={setPopup}
      />
      <InsightPopup
        isOpen={insightPopup.isOpen}
        setOpen={(isOpen) => setInsightPopup({ ...insightPopup, isOpen })}
        content={insightPopup.content}
        isLoading={insightPopup.isLoading}
      />
      <div className="lg:p-0 p-5">
        <div className="flex items-center lg:justify-start justify-between relative">
          <img
            src={"/logo.png"}
            width={35}
            height={35}
            alt="logo"
            className="lg:block hidden"
          />
          <h2 className="text-text text-2xl my-2 ml-2">AI Health Coach</h2>
          <button
            className="text-text lg:hidden block"
            onClick={() => setOpen(!isOpen)}
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-full bg-primary rounded-2xl p-3 flex-grow flex flex-col overflow-hidden">
        {viewMode === "breakdown" ? (
          <BreakdownView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            total={total}
            isLoading={isLoading}
            foodEntries={foodEntries}
          />
        ) : (
          <HistoryView
            historicalTotals={historicalTotals}
            setSelectedDate={(date) => {
              setSelectedDate(new Date(date));
              setViewMode("breakdown");
            }}
            setViewMode={setViewMode}
          />
        )}

        <div className="pt-2 flex flex-col">
          {viewMode === "breakdown" && (
            <button
              onClick={fetchInsight}
              className="flex items-center justify-center w-full hover:bg-hovercl bg-transparent border border-white/20 transition-all duration-300 rounded-lg py-2 px-3 text-text my-[8px] text-center text-sm"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Give Insight
            </button>
          )}
          <button
            onClick={() =>
              setViewMode(viewMode === "breakdown" ? "history" : "breakdown")
            }
            className="flex items-center justify-center w-full hover:bg-hovercl bg-input transition-all duration-300 rounded-lg py-4 px-4 outline-none border-none text-text my-[1px] text-center"
          >
            {viewMode === "breakdown" ? "History" : "Breakdown"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bar;
