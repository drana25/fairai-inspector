import { Navigate } from 'react-router-dom';
import { isDemoMode } from '../data/demoData';

export default function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading FairAI Inspector...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemoMode()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
