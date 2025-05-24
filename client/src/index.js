/**
 * Entry point for the React application.
 * 
 * - Imports React and ReactDOM for rendering the app.
 * - Imports the main App component.
 * - Creates a root DOM node using React 18's `createRoot` API.
 * - Renders the App component inside the root element with id "root".
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
