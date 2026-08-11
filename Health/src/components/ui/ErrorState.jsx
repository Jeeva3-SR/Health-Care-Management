import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the backend API.',
  onRetry,
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center bg-rose-50/50 rounded-2xl border border-rose-100 my-4">
      <div className="h-14 w-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h4 className="text-base font-bold text-slate-900 tracking-tight">{title}</h4>
      <p className="text-xs text-rose-700/80 max-w-md mt-1 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
