import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DownloadPage from "./pages/Download";
import ModelPage from "./pages/Model";

function App() {
  return (
    <div className="p-[20px] bg-main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/model" element={<ModelPage />} />
      </Routes>
    </div>
  );
}

export default App;
