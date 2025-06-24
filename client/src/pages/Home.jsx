import React from "react";
import { useFood } from "../context/FoodDataContext";
import Chat from "../components/Chat";
import FullScreenLoader from "../components/FullScreenLoader";
import Bar from "../components/Bar";

function Home() {
  const { isSystemReady, systemCheckMessage } = useFood();

  // Show a full-screen loader until the initial system checks are complete
  if (!isSystemReady) {
    return <FullScreenLoader message={systemCheckMessage} />;
  }

  return (
    <div className="flex flex-row h-screen p-4 bg-main gap-4">
      <Bar />
      <Chat />
    </div>
  );
}

export default Home;
