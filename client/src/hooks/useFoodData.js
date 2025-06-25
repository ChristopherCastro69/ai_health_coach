import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/healthCoachApi";

/**
 * A custom hook to manage all food-related data, state, and API interactions.
 */
export function useFoodData() {
  const navigate = useNavigate();

  // State
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [systemCheckMessage, setSystemCheckMessage] =
    useState("Checking system...");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState({
    model: "gemma2:2b",
    includesImage: false,
  });
  const [update, setUpdate] = useState(false);
  const [foodDataVersion, setFoodDataVersion] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [historicalTotals, setHistoricalTotals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // System check
  useEffect(() => {
    const checkSystem = async () => {
      try {
        setSystemCheckMessage("Checking if Ollama is installed...");
        await api.checkOllama();
        setSystemCheckMessage("Checking for the required AI model...");
        await api.checkModel();
        setSystemCheckMessage("Great, you have everything. Redirecting....");
        setTimeout(() => setIsSystemReady(true), 2000);
      } catch (error) {
        if (error.message.includes("Ollama")) navigate("/download");
        else navigate("/model");
      }
    };
    checkSystem();
  }, [navigate]);

  // Fetch historical totals
  useEffect(() => {
    if (!isSystemReady) return;
    const fetchHistory = async () => {
      try {
        const data = await api.getHistoricalTotals();
        setHistoricalTotals(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };
    fetchHistory();
  }, [isSystemReady]);

  // Fetch food data for the selected date
  useEffect(() => {
    if (!isSystemReady) return;
    const fetchFoodData = async () => {
      setIsDataLoading(true);
      try {
        const data = await api.getFoodEntriesForDate(selectedDate);
        const total = data.reduce((sum, entry) => sum + entry.calories, 0);
        setDailyTotal(total);
        setFoodEntries(data);

        let summaryMessage;
        if (data.length > 0) {
          let advice = "";
          if (total < 1500)
            advice =
              "This is a light calorie intake. Make sure you're getting all the nutrients you need to feel your best!";
          else if (total <= 2200)
            advice =
              "You're in a great calorie range. Keep up the fantastic work with your balanced choices!";
          else
            advice =
              "This is a higher calorie day. Remember that consistency is more important than perfection. You can balance it out tomorrow!";
          const summaryText = `You've had a total of ${total} kcal for this day. ${advice}`;
          summaryMessage = { who: "server", text: summaryText };
        } else {
          summaryMessage = {
            who: "server",
            text: `No food entries found for ${selectedDate
              .toISOString()
              .slice(0, 10)}. Add something!`,
          };
        }
        if (window.__pendingAIMessage) {
          setMessages((current) => [
            ...current,
            window.__pendingAIMessage,
            summaryMessage,
          ]);
          window.__pendingAIMessage = null;
        } else {
          setMessages([summaryMessage]);
        }
      } catch (error) {
        setMessages([
          {
            who: "server",
            text: "Could not load food entries. Please try again later.",
          },
        ]);
        setDailyTotal(0);
        setFoodEntries([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchFoodData();
  }, [selectedDate, foodDataVersion, isSystemReady]);

  // For manual refresh
  const refetchFoodData = useCallback(
    () => setFoodDataVersion((v) => v + 1),
    []
  );

  return {
    isSystemReady,
    systemCheckMessage,
    isDataLoading,
    messages,
    setMessages,
    model,
    setModel,
    update,
    setUpdate,
    dailyTotal,
    foodEntries,
    historicalTotals,
    selectedDate,
    setSelectedDate,
    refetchFoodData,
  };
}
