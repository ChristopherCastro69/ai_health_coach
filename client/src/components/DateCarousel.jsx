import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Date formatting options
const fullDateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function DateCarousel({ selectedDate, onDateChange }) {
  // Use selectedDate for display, default to today only if not provided
  const date = selectedDate ? new Date(selectedDate) : new Date();

  const goToPreviousDay = () => {
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
    onDateChange(prevDate);
  };

  const goToNextDay = () => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    onDateChange(nextDate);
  };

  const isToday = () => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-1 rounded-lg w-full max-w-xs mx-auto my-2 bg-input text-text">
      <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous day</span>
      </Button>
      <div className="text-sm font-medium text-center flex-1 whitespace-nowrap flex items-center justify-center">
        <span>{fullDateFormat.format(date)}</span>
        {isToday() && (
          <span className="ml-2 text-xs font-semibold text-text bg-hovercl px-2 py-0.5 rounded-full">
            Today
          </span>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={goToNextDay}>
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next day</span>
      </Button>
    </div>
  );
}
