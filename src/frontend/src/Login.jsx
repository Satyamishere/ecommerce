import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Fill both email and password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:7000/api/v1/users/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Login successful");
        console.log(res.data.data);
        if (res.data.data?.role?.includes("admin")) {
          navigate("/admindashboard");
        } else {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      }
      localStorage.setItem("user", JSON.stringify(res.data.data));
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your email"
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
