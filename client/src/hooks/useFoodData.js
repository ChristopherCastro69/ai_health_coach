import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/healthCoachApi";

/**
 * A custom hook to manage all food-related data, state, and API interactions.
 */
export function useFoodData() {
  const navigate = useNavigate();

  // State for UI and data
  const [messages, setMessages] = useState([]);

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


  // --- Functions to be used by components ---

  return {
    // Data
    messages,


    // State
    isSystemReady,
    systemCheckMessage,

    // Setters & Actions
    setMessages,
  
  };
}
