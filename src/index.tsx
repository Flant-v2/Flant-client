import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./styles/custom.scss";

const root = createRoot(document.getElementById("root") as HTMLElement);


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
