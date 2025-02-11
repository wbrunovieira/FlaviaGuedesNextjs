'use client';
import React from 'react';

interface ToggleButtonProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
}) => (
  <div className="md:hidden">
    <input
      type="checkbox"
      id="mobile-menu-toggle"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <label
      htmlFor="mobile-menu-toggle"
      className="relative w-10 h-10 cursor-pointer flex flex-col items-center justify-center gap-[10px] transition duration-300"
    >
      <div
        className={`w-full h-1 bg-white rounded transition duration-300 ${
          checked
            ? 'ml-[13px] rotate-45 origin-left bg-gold'
            : 'bg-gray-700'
        }`}
      />
      <div
        className={`w-full h-1 bg-white rounded transition duration-300 ${
          checked
            ? 'rotate-[135deg] origin-center bg-gold'
            : 'bg-gray-700'
        }`}
      />
      <div
        className={`w-full h-1 bg-white rounded transition duration-300 ${
          checked
            ? 'ml-[13px] -rotate-45 origin-left bg-gold'
            : 'bg-gray-700'
        }`}
      />
    </label>
  </div>
);

export default ToggleButton;
