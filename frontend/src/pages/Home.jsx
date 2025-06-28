import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <h1 className="text-5xl font-serif font-bold text-blue-800 mb-6 text-center animate-fade-in">
        Welcome to PrepTrail
      </h1>
      <p className="text-xl text-gray-600 mb-10 text-center max-w-lg leading-relaxed animate-fade-in-delay">
        Embark on your journey to master DSA with curated questions designed for
        top tech interviews.
      </p>
      <Link
        to="/login"
        className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 animate-slide-up"
      >
        Start Your Journey
      </Link>
    </div>
  );
}

export default Home;
