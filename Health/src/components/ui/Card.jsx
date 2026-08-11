import React from 'react';
import clsx from 'clsx';

const Card = ({ children, variant = 'default', className, onClick, ...props }) => {
  const variants = {
    default: 'bg-white border border-slate-200/80 shadow-xs',
    outlined: 'bg-white border-2 border-slate-200',
    elevated: 'bg-white shadow-md border border-slate-100',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl p-6 transition-all duration-200',
        variants[variant],
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
