import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../../store/useAuthstore';

const DashboardLayout = ({ sidebarItems = [] }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <Sidebar
        items={sidebarItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        role={role}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          user={user}
          role={role}
          onLogout={handleLogout}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
