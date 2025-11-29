import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Lightbulb, Sparkles, Code2, Rocket } from 'lucide-react';
import { Spotlight } from './ui/Spotlight';
import { TextReveal } from './ui/TextReveal';
import { Input } from './ui/Input';
import { api } from '../services/api';

enum AuthMode {
  LOGIN,
  REGISTER
}

interface LoginScreenProps {
  onAuthSuccess?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === AuthMode.LOGIN) {
        const response = await api.login({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setSuccess(true);
        console.log('Login successful:', response.user);
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1000);
      } else {
        const response = await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setSuccess(true);
        console.log('Registration successful:', response.user);
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0, 
      x: 20, 
      transition: { duration: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (!mounted) return null;

  return (
    <div className="flex w-full h-screen bg-black relative overflow-hidden">
      
      {/* Background Gradients/Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-40 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* LEFT SIDE: Form */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 lg:p-12 relative z-10">
        <Spotlight className="w-full max-w-md p-8 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
          
          <div className="mb-8 flex flex-col gap-2">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-brand-400 mb-2"
            >
              <div className="p-2 bg-brand-500/10 rounded-lg">
                <Sparkles size={20} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">Lumina</span>
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode === AuthMode.LOGIN ? "login-header" : "register-header"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold font-display text-white mb-2">
                  {mode === AuthMode.LOGIN ? "Welcome back" : "Start your journey"}
                </h1>
                <p className="text-neutral-400">
                  {mode === AuthMode.LOGIN 
                    ? "Enter your credentials to access your creative space." 
                    : "Join thousands of creators turning ideas into reality."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
              >
                {mode === AuthMode.LOGIN ? 'Login successful!' : 'Registration successful!'}
              </motion.div>
            )}

            <motion.form
              key={mode}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {mode === AuthMode.REGISTER && (
                 <motion.div variants={itemVariants}>
                    <Input 
                      label="Full Name" 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      icon={<User size={18} />} 
                      placeholder="John Doe"
                    />
                 </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Input 
                  label="Email Address" 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={<Mail size={18} />} 
                  placeholder="name@example.com"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input 
                  label="Password" 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={<Lock size={18} />} 
                  placeholder="••••••••"
                  required
                />
              </motion.div>

              {mode === AuthMode.LOGIN && (
                <motion.div variants={itemVariants} className="flex justify-end">
                  <button type="button" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                    Forgot Password?
                  </button>
                </motion.div>
              )}

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white font-medium shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : mode === AuthMode.LOGIN ? "Sign In" : "Create Account"}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-neutral-500 text-sm">
              {mode === AuthMode.LOGIN ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={toggleMode}
                className="text-white hover:text-brand-300 font-medium transition-colors relative"
              >
                {mode === AuthMode.LOGIN ? "Sign up" : "Log in"}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-brand-300 transition-all duration-300 hover:w-full"></span>
              </button>
            </p>
          </div>

        </Spotlight>
      </div>

      {/* RIGHT SIDE: Visual/Ideas Showcase */}
      <div className="hidden lg:flex w-1/2 h-full bg-neutral-900 border-l border-neutral-800 relative overflow-hidden items-center justify-center p-12">
        {/* Abstract Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, #444 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}></div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-12">
             <FloatingIcon delay={0} x={-120} y={-80} icon={<Lightbulb size={24} className="text-yellow-400" />} />
             <FloatingIcon delay={1.5} x={140} y={-40} icon={<Code2 size={24} className="text-blue-400" />} />
             <FloatingIcon delay={3} x={-80} y={100} icon={<Rocket size={24} className="text-red-400" />} />
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
             <div className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 font-medium mb-6">
                {mode === AuthMode.LOGIN ? "DAILY INSPIRATION" : "JOIN THE COMMUNITY"}
             </div>
             
             {mode === AuthMode.LOGIN ? (
                <TextReveal 
                  text="Innovation distinguishes between a leader and a follower. Log in to access your dashboard of infinite possibilities." 
                  className="text-4xl md:text-5xl font-display font-bold leading-tight text-white mb-6"
                />
             ) : (
                <TextReveal 
                   text="The best way to predict the future is to create it. Join us and start building the tools of tomorrow." 
                   className="text-4xl md:text-5xl font-display font-bold leading-tight text-white mb-6"
                   delay={0.2}
                />
             )}
             
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.5, duration: 1 }}
               className="text-lg text-neutral-400 leading-relaxed"
             >
               Experience a workflow designed for speed, tailored for creativity, and engineered for growth.
             </motion.p>
          </motion.div>
        </div>

        {/* Animated Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>
    </div>
  );
};

const SocialButton: React.FC<{ icon: string, label: string }> = ({ icon, label }) => {
  return (
    <button className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 transition-all flex items-center justify-center text-neutral-400 hover:text-white group">
      <span className="font-semibold text-sm group-hover:scale-110 transition-transform">{icon}</span>
    </button>
  );
};

const FloatingIcon: React.FC<{ delay: number, x: number, y: number, icon: React.ReactNode }> = ({ delay, x, y, icon }) => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-12 h-12 bg-neutral-800/80 backdrop-blur-md border border-neutral-700 rounded-2xl flex items-center justify-center shadow-xl"
      animate={{ 
        y: [y, y - 10, y],
        x: x,
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        delay: delay,
        ease: "easeInOut" 
      }}
    >
      {icon}
    </motion.div>
  );
};

export default LoginScreen;