import React from 'react';
import clsx from 'clsx';

const Avatar = ({ name = '', src, size = 'md', className }) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div
      className={clsx(
        'rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden select-none',
        sizes[size],
        className
      )}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : getInitials(name)}
    </div>
  );
};

export default Avatar;
