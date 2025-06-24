import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { FoodDataProvider } from "./context/FoodDataContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FoodDataProvider>
        <App />
      </FoodDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
