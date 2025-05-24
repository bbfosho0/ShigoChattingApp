/**
 * Login component for user authentication.
 *
 * Renders a login form that allows users to enter their email and password.
 * On submission, sends a POST request to the backend to authenticate the user.
 * If authentication is successful, updates the authentication context and navigates to the chat page.
 *
 * @component
 * @returns {JSX.Element} The rendered Login component.
 */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data);
      navigate("/chat");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
