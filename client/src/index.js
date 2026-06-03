import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import './index.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./context/ThemeContext.js";
import { MusicProvider } from "./context/MusicContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ThemeProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </ThemeProvider>
    <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
  </>
);
