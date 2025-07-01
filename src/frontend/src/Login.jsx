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
        console.log(res.data.data)
        if (res.data.data?.role?.includes("admin")) {
          navigate("/admindashboard");
        } else {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      }
      localStorage.setItem("user", JSON.stringify(res.data.data));//for cahtting purpose

      console.log(res);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter your email"
        />

        <label className="block mb-2 text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
