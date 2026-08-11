import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({ value = '', onChange, placeholder = 'Search records...', className }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (onChange && debouncedTerm !== value) {
      onChange(debouncedTerm);
    }
  }, [debouncedTerm, onChange, value]);

  return (
    <div className={`relative w-full max-w-md ${className || ''}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl py-2.5 pl-10 pr-9 transition-all duration-200 outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 placeholder:text-slate-400"
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm('');
            if (onChange) onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
