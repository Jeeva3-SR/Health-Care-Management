import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Menu, CheckCircle2, FileText, Calendar, ShieldAlert } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '../../services/notificationService';
import Breadcrumb from './Breadcrumb';
import Avatar from '../ui/Avatar';
import { toast } from 'sonner';

const Navbar = ({ user, role, onLogout, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchInterval: 10000,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const markReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayName = (u, r) => {
    if (!u) return 'User Profile';
    if (u.name) return u.name;
    const identifier = u.username || u.email || '';
    if (identifier.includes('@')) {
      const parts = identifier.split('@')[0];
      const formatted = parts.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return r === 'DOCTOR' ? `Dr. ${formatted}` : formatted;
    }
    return r === 'DOCTOR' && !identifier.startsWith('Dr.') ? `Dr. ${identifier}` : identifier;
  };

  const displayName = getDisplayName(user, role);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/70 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-blue-600 ring-2 ring-white text-[9px] font-black text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scaleIn origin-top-right">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllMutation.mutate()}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markReadMutation.mutate(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3 cursor-pointer ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                        {n.type === 'APPOINTMENT' ? (
                          <Calendar className="h-4 w-4" />
                        ) : n.type === 'PRESCRIPTION' ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate">{n.title}</p>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[9px] text-slate-400 font-semibold mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden cursor-pointer"
          >
            <Avatar name={displayName} size="md" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                {role?.toLowerCase() || 'authenticated'}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-scaleIn origin-top-right">
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[10px] text-blue-600 font-semibold uppercase">{role}</p>
              </div>

              <button
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
