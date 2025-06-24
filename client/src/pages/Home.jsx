import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../components/Bar";
import Chat from "../components/Chat";
import { useFood } from "../context/FoodDataContext";
import FullScreenLoader from "../components/FullScreenLoader";

// Note: The original Provider component is being repurposed as the Home page.
export default function Home() {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const {
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
  } = useFood();

  if (!isSystemReady) {
    return <FullScreenLoader message={systemCheckMessage} />;
  }

  return (
    <div className="flex flex-row top-0 left-0 z-[9999] p-4 bg-main gap-4 w-full h-screen">
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
          <img src={"/ailogo.png"} alt="logo" width={70} height={70} />
        </div>
        <Chat
          messages={messages}
          setMessages={setMessages}
          setModel={setModel}
          model={model}
          update={update}
          setFoodDataVersion={refetchFoodData}
        />
      </div>
    </div>
  );
}
