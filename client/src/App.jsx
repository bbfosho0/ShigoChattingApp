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
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chatroom from "./pages/Chatroom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={user ? <Chatroom /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


