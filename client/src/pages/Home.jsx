import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../components/Bar";
import Chat from "../components/Chat";

// Note: The original Provider component is being repurposed as the Home page.
export default function Home() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState(
    "Just a sec, We checking ollama is installed on your computer or not."
  );
  const [model, setModel] = useState({
    model: "gemma2:2b",
    includesImage: false,
  });
  const [update, setUpdate] = useState(false);
  const [foodDataVersion, setFoodDataVersion] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [historicalTotals, setHistoricalTotals] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // This effect handles the initial check for Ollama and the AI model
    fetch("http://127.0.0.1:8000/api/check-ollama/")
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          setLoaderMessage(
            "Great, it looks like there is ollama in your computer, one more sec we are checking for a model"
          );
          fetch("http://127.0.0.1:8000/api/check-model/")
            .then((res) => res.json())
            .then((res) => {
              if (res.message === true) {
                setLoaderMessage("Great, you have everything. Redirecting....");
                setTimeout(() => {
                  setLoader(false);
                }, 2000);
              } else {
                navigate("/model");
              }
            });
        } else {
          navigate("/download");
        }
      })
      .catch((err) => {
        console.error("Error checking backend:", err);
        navigate("/download");
      });
  }, [navigate]);

  useEffect(() => {
    // Fetch historical data once on component mount
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/food-entries/total_history/"
        );
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistoricalTotals(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
        // Handle error, maybe show a notification
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchFoodData = async () => {
      setIsDataLoading(true);

      // Format date to YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/food-entries/history/?date=${formattedDate}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        // Calculate total calories
        const total = data.reduce((sum, entry) => sum + entry.calories, 0);
        setDailyTotal(total);
        setFoodEntries(data);

        // Generate and set the summary message for the chat
        let summaryMessage;
        if (data.length > 0) {
          let advice = "";
          if (total < 1500) {
            advice =
              "This is a light calorie intake. Make sure you're getting all the nutrients you need to feel your best!";
          } else if (total <= 2200) {
            advice =
              "You're in a great calorie range. Keep up the fantastic work with your balanced choices!";
          } else {
            advice =
              "This is a higher calorie day. Remember that consistency is more important than perfection. You can balance it out tomorrow!";
          }
          const summaryText = `You've had a total of ${total} kcal for this day. ${advice}`;
          summaryMessage = {
            who: "server",
            text: summaryText,
          };
        } else {
          summaryMessage = {
            who: "server",
            text: `No food entries found for ${formattedDate}. Add something!`,
          };
        }

        // If the last message is from the AI and matches the summary, don't overwrite
        if (
          messages.length > 0 &&
          messages[messages.length - 1].who === "server" &&
          messages[messages.length - 1].text.startsWith("Added:")
        ) {
          // Keep the AI message and add the summary below it
          setMessages((current) => [...current, summaryMessage]);
        } else {
          // Otherwise, just show the summary
          setMessages([summaryMessage]);
        }
      } catch (error) {
        console.error("Failed to fetch food data:", error);
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
  }, [selectedDate, foodDataVersion]);

  return (
    <div className="flex flex-row">
      {loader && (
        <div className="w-full h-screen fixed top-0 left-0 z-[9999] bg-primary flex items-center justify-center flex-col">
          <div className="text-center my-3 text-text text-2xl">
            {loaderMessage}
          </div>
          <div>
            {loader && (
              <div>
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-300 fill-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={
          isOpen
            ? "left-0 lg:relative fixed z-50 h-screen top-0 shh transition-all duration-500"
            : "shh left-[-100%] top-0 lg:left-0 lg:relative h-screen fixed z-50 transition-all duration-500"
        }
      >
        <Bar
          update={update}
          setUpdate={setUpdate}
          setMessages={setMessages}
          setModel={setModel}
          isOpen={isOpen}
          setOpen={setOpen}
          total={dailyTotal}
          isLoading={isDataLoading}
          onDateSelect={setSelectedDate}
          foodEntries={foodEntries}
          historicalTotals={historicalTotals}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="w-full lg:pr-2">
        <div className="w-full lg:hidden flex justify-between items-center bg-primary text-text py-2 px-4 rounded-lg">
          <button onClick={() => setOpen(!isOpen)}>
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <img src={"/logo.png"} alt="logo" width={70} height={70} />
        </div>
        <Chat
          messages={messages}
          setMessages={setMessages}
          setModel={setModel}
          model={model}
          update={update}
          setFoodDataVersion={setFoodDataVersion}
        />
      </div>
    </div>
  );
}
