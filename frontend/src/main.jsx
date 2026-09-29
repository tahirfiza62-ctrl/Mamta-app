import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#4A3032",
          color: "#FFF9F4",
          borderRadius: "12px",
          padding: "14px 18px",
          fontSize: "13px",
          fontWeight: "500",
        },
        success: {
          iconTheme: {
            primary: "#D98F9A",
            secondary: "#FFF9F4",
          },
        },
        error: {
          iconTheme: {
            primary: "#E57373",
            secondary: "#FFF9F4",
          },
        },
      }}
    />
  </React.StrictMode>
);