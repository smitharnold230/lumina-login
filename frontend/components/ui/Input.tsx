import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative w-full mb-6 group">
      <div className="absolute left-3 top-3.5 text-neutral-500 transition-colors duration-300 group-focus-within:text-brand-400">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-brand-500/50 transition-all duration-300 placeholder-transparent peer"
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          props.onChange?.(e);
        }}
      />
      <label
        className={`absolute left-10 pointer-events-none transition-all duration-300 ease-out
          ${isFocused || hasValue ? '-top-2.5 text-xs text-brand-400 bg-neutral-900 px-2' : 'top-3.5 text-neutral-400'}
        `}
      >
        {label}
      </label>
      
      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-brand-500 transition-all duration-500 peer-focus:w-full" />
    </div>
  );
};