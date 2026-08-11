import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LayoutDashboard, Stethoscope, UserCog, User, Settings } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Stethoscope, label: 'Doctor Approvals', path: '/admin/doctors' },
  { icon: UserCog, label: 'User Management', path: '/admin/users' },
  { icon: User, label: 'Profile', path: '/admin/profile' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = () => {
  return <DashboardLayout sidebarItems={sidebarItems} />;
};

export default AdminLayout;
