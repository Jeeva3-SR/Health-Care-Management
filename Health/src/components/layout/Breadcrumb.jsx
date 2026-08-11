import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.replace(/-/g, ' ');

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 capitalize">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-600 capitalize transition-colors">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
