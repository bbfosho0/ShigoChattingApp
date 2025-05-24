/**
 * Register component allows users to create a new account by submitting a username, email, and password.
 *
 * Features:
 * - Manages form state for username, email, and password.
 * - Handles input changes and form submission.
 * - Sends registration data to the backend API.
 * - Navigates to the login page upon successful registration.
 * - Displays an alert if registration fails.
 *
 * @component
 * @returns {JSX.Element} The registration form UI.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
