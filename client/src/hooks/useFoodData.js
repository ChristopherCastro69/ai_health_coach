import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/healthCoachApi";

/**
 * A custom hook to manage all food-related data, state, and API interactions.
 */
export function useFoodData() {
  const navigate = useNavigate();

  // State for UI and data
  const [messages, setMessages] = useState([]);
  const [foodEntries, setFoodEntries] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [historicalTotals, setHistoricalTotals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State for loading and system checks
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [systemCheckMessage, setSystemCheckMessage] =
    useState("Checking system...");

  // --- Effects for Initial Load and Data Fetching ---

  // Effect for the initial system check (Ollama & Model)
  useEffect(() => {
    const checkSystem = async () => {
      try {
        setSystemCheckMessage("Checking if Ollama is installed...");
        await api.checkOllama();

        setSystemCheckMessage("Checking for the required AI model...");
        await api.checkModel();

        setSystemCheckMessage("System is ready!");
        setIsSystemReady(true);
      } catch (error) {
        if (error.message.includes("Ollama")) {
          navigate("/download");
        } else {
          navigate("/model");
        }
      }
    };
    checkSystem();
  }, [navigate]);

  // Effect to fetch the main data for the selected date
  useEffect(() => {
    const fetchDateData = async () => {
      if (!isSystemReady) return; // Don't fetch until system is ready

      setIsDataLoading(true);
      const dateStr = selectedDate.toISOString().split("T")[0];

      try {
        // We can fetch data in parallel for a faster experience
        const [entries, total, history] = await Promise.all([
          api.getFoodEntriesForDate(dateStr),
          api.getDailyTotal(dateStr),
          api.getHistoricalSummary(),
        ]);

        setFoodEntries(entries);
        setDailyTotal(total.total_calories);
        setHistoricalTotals(history);
      } catch (error) {
        console.error("Failed to fetch food data:", error);
        // Handle error state in UI
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchDateData();
  }, [selectedDate, isSystemReady]);

  // --- Functions to be used by components ---

  const addMessageFromAI = useCallback(async (message) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { who: "client", text: message }]);

    try {
      // Get new food entries from AI
      const newEntries = await api.createFoodEntryFromAI(message);

      // Create a summary message
      const summaryText = newEntries
        .map((e) => `${e.food_name} (${e.calories} kcal)`)
        .join(", ");
      setMessages((prev) => [
        ...prev,
        { who: "server", text: `Added: ${summaryText}` },
      ]);

      // Refetch data for the current date to update totals and entry list
      setSelectedDate(new Date(newEntries[0].consumed_at));
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { who: "server", text: `Sorry, there was an error: ${error.message}` },
      ]);
    }
  }, []);

  const fetchHealthInsight = useCallback(async () => {
    const dateStr = selectedDate.toISOString().split("T")[0];

    // Add a thinking message
    const thinkingId = Date.now();
    setMessages((prev) => [
      ...prev,
      { who: "server", text: "Analyzing your day...", id: thinkingId },
    ]);

    try {
      const insight = await api.getHealthInsight(dateStr);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        { who: "server", text: insight.insight, isInsight: true },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          who: "server",
          text: `Sorry, there was an error getting your insight: ${error.message}`,
        },
      ]);
    }
  }, [selectedDate]);

  return {
    // Data
    messages,
    foodEntries,
    dailyTotal,
    historicalTotals,
    selectedDate,

    // State
    isDataLoading,
    isSystemReady,
    systemCheckMessage,

    // Setters & Actions
    setMessages,
    setSelectedDate,
    addMessageFromAI,
    fetchHealthInsight,
  };
}
