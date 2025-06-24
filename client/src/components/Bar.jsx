import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { useFood } from "../context/FoodDataContext";
import BreakdownView from "./Bar/BreakdownView";
import HistoryView from "./Bar/HistoryView";

/**
 * The main sidebar component. It no longer manages any core logic itself,
 * but instead consumes the shared state and functions from the FoodDataContext.
 */
function Bar() {
  const [viewMode, setViewMode] = useState("breakdown");
  const { fetchHealthInsight } = useFood();

  return (
    <div className="w-[22rem] h-full bg-primary rounded-xl relative flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center">
        <img src={"/ailogo.png"} width={35} height={35} alt="logo" />
        <h2 className="text-text text-2xl my-2 ml-2">KICHS AI</h2>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col bg-primary rounded-2xl overflow-hidden">
        {viewMode === "breakdown" ? (
          <BreakdownView />
        ) : (
          <HistoryView setViewMode={setViewMode} />
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex-shrink-0 pt-2 flex flex-col gap-2">
        {viewMode === "breakdown" && (
          <button
            onClick={fetchHealthInsight}
            className="flex items-center justify-center w-full hover:bg-hovercl bg-transparent border border-white/20 transition-all duration-300 rounded-lg py-3 px-4 text-text text-center"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Give Insight
          </button>
        )}
        <button
          onClick={() =>
            setViewMode(viewMode === "breakdown" ? "history" : "breakdown")
          }
          className="flex items-center justify-center w-full hover:bg-hovercl bg-input transition-all duration-300 rounded-lg py-4 px-4 text-text text-center"
        >
          {viewMode === "breakdown" ? "View History" : "View Breakdown"}
        </button>
      </div>
    </div>
  );
}

export default Bar;
