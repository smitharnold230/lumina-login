import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, User, Mail, LogOut, Sparkles } from 'lucide-react';
import { Spotlight } from './ui/Spotlight';

interface UserData {
  id: string;
  name: string;
  email: string;
}

const SuccessPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background Gradients/Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-40 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Abstract Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, #444 1px, transparent 0)',
        backgroundSize: '40px 40px' 
      }}></div>

      <div className="relative z-10 w-full max-w-2xl p-6">
        <Spotlight className="w-full p-12 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
          
          {/* Header with Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-brand-400 mb-8 justify-center"
          >
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <Sparkles size={24} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">Lumina</span>
          </motion.div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 200 
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
              <CheckCircle size={80} className="text-green-400 relative" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
              Welcome Back!
            </h1>
            <p className="text-lg text-neutral-400">
              You have successfully logged in to your account.
            </p>
          </motion.div>

          {/* User Info Card */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8 space-y-4"
            >
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3 text-neutral-300">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-full flex items-center justify-center">
                    <User size={20} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Full Name</p>
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="h-px bg-neutral-700" />

                <div className="flex items-center gap-3 text-neutral-300">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-full flex items-center justify-center">
                    <Mail size={20} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Email Address</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Stats/Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-400 mb-1">✓</div>
              <p className="text-xs text-neutral-400">Authenticated</p>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">🔒</div>
              <p className="text-xs text-neutral-400">Secure Session</p>
            </div>
            <div className="bg-neutral-800/30 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">⚡</div>
              <p className="text-xs text-neutral-400">Ready to Go</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="space-y-3"
          >
            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white font-medium shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>

            <p className="text-center text-sm text-neutral-500">
              Your session is secure and will expire in 7 days
            </p>
          </motion.div>

        </Spotlight>
      </div>

      {/* Animated Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
    </div>
  );
};

export default SuccessPage;
