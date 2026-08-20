import React, { useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Chatroom from "./pages/Chatroom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SplashScreen from "./pages/SplashScreen";
import { AuthContext } from "./context/AuthContext";

function AnimatedRoutes() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<SplashScreen />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/chat" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/chat" /> : <Register />}
          />
          <Route path="/chat" element={user ? <Chatroom /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
