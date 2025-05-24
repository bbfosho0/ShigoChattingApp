/**
 * Main application component that sets up routing and authentication context.
 *
 * - Wraps the app with `AuthProvider` to provide authentication state.
 * - Uses React Router to define routes for Register, Login, and Chatroom pages.
 *
 * Routes:
 *   - "/" renders the Register page.
 *   - "/login" renders the Login page.
 *   - "/chat" renders the Chatroom page.
 *
 * @component
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chatroom from "./pages/Chatroom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chatroom />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

