'use client';

import { useRef, useState } from 'react';

type ButtonAnimatedGradientProps = {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const sizeClasses = {
  sm: 'h-8 px-4 text-sm',
  md: 'h-10 px-5 text-base',
  lg: 'h-12 px-6 text-lg',
};

const ButtonAnimatedGradient = ({
  text,
  size = 'md',
  onClick,
  children,
  className = '',
}: ButtonAnimatedGradientProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!buttonRef.current || isFocused) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative w-fit items-left justify-left overflow-hidden rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 
        ${sizeClasses[size]} 
        border-[#FFD700] dark:border-[#A67C00] 
        bg-gradient-to-r from-[#FFD700] to-[#C8A04B] dark:from-[#5A4100] dark:to-[#A67C00] 
        font-medium text-white shadow-2xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(100px circle at ${position.x}px ${position.y}px, #FFD70055, #00000026)`,
        }}
      />

      <span className="relative z-20 flex items-center space-x-2 text-center">
        {children} {text && <span>{text}</span>}
      </span>
    </button>
  );
};

export default ButtonAnimatedGradient;
