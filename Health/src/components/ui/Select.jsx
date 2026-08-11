import React from 'react';
import clsx from 'clsx';

const Select = React.forwardRef(
  ({ label, error, options = [], className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl py-2.5 px-4 transition-all duration-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold cursor-pointer shadow-xs',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
