import React from "react";
import { DateCarousel } from "../DateCarousel";

function BreakdownView({
  selectedDate,
  setSelectedDate,
  total,
  isLoading,
  foodEntries,
}) {
  return (
    <>
      <div>
        <DateCarousel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="w-full bg-input rounded-lg py-4 px-4 text-text my-[12px] text-center">
          {isLoading ? "Loading..." : `Total: ${total} kcal`}
        </div>
        <h2 className="text-text text-lg font-semibold mt-4 mb-2">
          Breakdown:
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {foodEntries && foodEntries.length > 0 ? (
          foodEntries.map((entry, index) => (
            <div
              key={index}
              className="w-full flex flex-row justify-between text-text text-sm py-2 border-b border-input"
            >
              <div className="text-start">{entry.food_name}</div>
              <div className="ml-1 text-end">{entry.calories} kcal</div>
            </div>
          ))
        ) : (
          <div className="text-text text-sm text-center py-4">
            No entries for this day.
          </div>
        )}
      </div>
    </>
  );
}

export default BreakdownView;
