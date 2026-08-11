import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Activity, LogOut } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ items = [], collapsed, onToggle, role, user, onLogout }) => {
  return (
    <aside
      className={clsx(
        'bg-slate-900 text-white flex flex-col transition-all duration-300 z-30 sticky top-0 h-screen shadow-xl border-r border-slate-800',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/30">
            <Activity className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fadeIn">
              <span className="font-bold tracking-tight text-white text-base leading-tight">CarePulse</span>
              <span className="text-[11px] text-sky-400 font-semibold tracking-wider uppercase">{role || 'Portal'}</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/doctor' || item.path === '/patient'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group relative',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-105" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <button
          onClick={onLogout}
          className={clsx(
            'w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all duration-200 cursor-pointer',
            collapsed && 'justify-center'
          )}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
