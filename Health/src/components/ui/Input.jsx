import React from 'react';
import clsx from 'clsx';

const Input = React.forwardRef(
  ({ label, error, icon: Icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
        )}
        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl py-2.5 px-4 transition-all duration-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-400 font-medium shadow-xs',
              Icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
