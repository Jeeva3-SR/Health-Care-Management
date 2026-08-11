import React from 'react';
import clsx from 'clsx';

const LoadingSkeleton = ({ variant = 'text', count = 1, className }) => {
  const items = Array.from({ length: count });

  if (variant === 'table') {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200/80 p-4 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded-lg w-1/4"></div>
        {items.map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={clsx('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
        {items.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className={clsx('h-4 bg-slate-200 rounded-md w-full', className)}></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
