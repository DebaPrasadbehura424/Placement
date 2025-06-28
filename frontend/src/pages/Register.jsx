import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios
        .post("http://localhost:5500/auth/register", formData)
        .then((res) => {
          // console.log(res.data);
          // sessionStorage.setItem("token", res.data.token);
          // sessionStorage.setItem("userId", res.data.user.id);
          navigate("/login");
        });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center text-blue-800">
          Register for PrepTrail
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
            Register
          </button>
        </form>
        {error && (
          <p className="text-rose-600 text-center mt-4 animate-fade-in">
            {error}
          </p>
        )}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
