import React from 'react';
import Card from './Card';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorStyles = {
    primary: 'bg-blue-50 text-blue-600 border-blue-100',
    secondary: 'bg-sky-50 text-sky-600 border-sky-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    error: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <Card className="flex items-center justify-between relative overflow-hidden border-slate-200/90 shadow-sm hover:shadow-md">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        {trendValue && (
          <div className="flex items-center space-x-1 text-xs font-semibold mt-1">
            {trend === 'up' ? (
              <span className="text-emerald-600 flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +{trendValue}
              </span>
            ) : (
              <span className="text-rose-600 flex items-center">
                <TrendingDown className="h-3.5 w-3.5 mr-0.5" /> -{trendValue}
              </span>
            )}
            <span className="text-slate-400">vs last month</span>
          </div>
        )}
      </div>

      {Icon && (
        <div
          className={clsx(
            'h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-2xs',
            colorStyles[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
