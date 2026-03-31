import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; //  Make sure this is imported
import './index.css'
import App from "./App.jsx";

// Get root element
const root = document.getElementById("root");

// Create root and render App
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);