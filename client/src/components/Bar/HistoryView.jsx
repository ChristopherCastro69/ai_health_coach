import React from "react";
import { useFood } from "../../context/FoodDataContext";
import { DatePicker } from "../DatePicker";

function HistoryView({ setViewMode }) {
  const { historicalTotals, setSelectedDate } = useFood();

  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date));
    setViewMode("breakdown");
  };

  return (
    <>
      <div>
        <DatePicker onDateSelect={handleDateSelect} />
        <h2 className="text-text text-lg font-semibold mt-4 mb-2">History:</h2>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {historicalTotals && historicalTotals.length > 0 ? (
          historicalTotals.map((item, index) => (
            <button
              key={index}
              className="w-full flex flex-row justify-between items-center text-text text-sm py-2 border-b border-input rounded hover:bg-hovercl focus:bg-hovercl transition-colors px-2"
              onClick={() => handleDateSelect(item.consumed_at)}
              tabIndex={0}
              type="button"
            >
              <span className="text-start">{item.consumed_at}</span>
              <span className="ml-1 text-end">{item.total_calories} kcal</span>
            </button>
          ))
        ) : (
          <div className="text-text text-sm text-center py-4">
            No historical data found.
          </div>
        )}
      </div>
    </>
  );
}

export default HistoryView;
