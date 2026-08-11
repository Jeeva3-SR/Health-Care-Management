import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-8xl font-black text-teal-600 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-900 mt-4">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-2 mb-8">
        The page or clinical resource you are requesting does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Return to Portal Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
