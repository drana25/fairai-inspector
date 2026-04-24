import { useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { setDemoMode } from '../data/demoData';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Login({ user }) {
  const navigate = useNavigate();

  // If already signed in, redirect
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Welcome to FairAI Inspector!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Sign in failed. Please try again.');
      }
    }
  };

  const handleDemoMode = () => {
    setDemoMode();
    toast.success('Demo mode activated!');
    navigate('/dashboard');
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1035] to-[#0a0a0f]" />

      {/* Particles */}
      <div className="particles-container absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Glow Orbs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] top-10 left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] bottom-10 right-[-100px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[380px] p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/30 mb-4">
            <span className="text-3xl">⚖️</span>
          </div>
          <h1 className="text-2xl font-bold">
            Fair<span className="text-indigo-400">AI</span> Inspector
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Detect bias in AI datasets
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-105 transition duration-200 mb-3 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>

        {/* Demo */}
        <button
          onClick={handleDemoMode}
          className="w-full py-3 rounded-xl border border-indigo-400/30 text-indigo-400 hover:bg-indigo-500/10 transition duration-200"
        >
          🔍 Try Demo (no account)
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

      {/* Examples Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute bottom-10 left-10 hidden xl:flex flex-col gap-4 max-w-sm"
      >
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 opacity-60 px-2 border-l-2 border-indigo-500">
           Featured Detections
        </h3>
        
        {/* Example 1 */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-300">Recruitment_Bias.csv</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">62% Fair</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">"Detected 14% gender pay gap in historical data"</p>
        </div>

        {/* Example 2 */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-300">Credit_Scoring_V3.csv</span>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">94% Fair</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">"Zero racial disparity found in model outputs"</p>
        </div>
      </motion.div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
