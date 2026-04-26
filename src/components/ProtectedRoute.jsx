import { Navigate } from 'react-router-dom';
import { isDemoMode } from '../data/demoData';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1e1b4b] to-[#0a0a1a] flex items-center justify-center overflow-hidden relative">
        {/* Animated particle glow */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl animate-pulse"></div>
        </div>

        {/* Loader ring */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="relative w-20 h-20 border-4 border-transparent rounded-full"
          style={{
            borderTopColor: "#6366f1",
            boxShadow: "0 0 20px rgba(99,102,241,0.6)",
          }}
        />

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-[45%] text-cyan-300 text-sm font-medium tracking-wide"
          style={{
            textShadow: "0 0 10px rgba(34,211,238,0.5)",
          }}
        >
          Loading FairAI Inspector...
        </motion.p>
      </div>
    );
  }

  if (!user && !isDemoMode()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
