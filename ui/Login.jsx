import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1035] to-[#0a0a0f]" />

      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      {/* Glow Orbs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] top-10 left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] bottom-10 right-[-100px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-[380px] p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/30 mb-4">
            ⚖️
          </div>
          <h1 className="text-2xl font-bold">
            Fair<span className="text-indigo-400">AI</span> Inspector
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Detect bias in AI datasets
          </p>
        </div>

        {/* Google Button */}
        <button className="w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-105 transition mb-3">
          Sign in with Google
        </button>

        {/* Demo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 rounded-xl border border-indigo-400/30 text-indigo-400 hover:bg-indigo-500/10 transition"
        >
          🔍 Try Demo
        </button>

        {/* Quote */}
        <p className="text-xs text-gray-500 text-center mt-6 italic">
          "Detected bias in 8 seconds"
        </p>

        {/* SDG */}
        <div className="mt-4 space-y-2">
          <div className="text-xs bg-pink-500/10 border border-pink-400/20 rounded-full px-3 py-1 text-pink-400 text-center">
            🎯 SDG 10 — Reduced Inequalities
          </div>
          <div className="text-xs bg-blue-500/10 border border-blue-400/20 rounded-full px-3 py-1 text-blue-400 text-center">
            ⚖️ SDG 16 — Justice
          </div>
        </div>
      </motion.div>
    </div>
  );
}