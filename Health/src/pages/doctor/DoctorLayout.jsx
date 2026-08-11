import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LayoutDashboard, Calendar, Users, User } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/doctor' },
  { icon: Calendar, label: 'Appointments Console', path: '/doctor/appointments' },
  { icon: Users, label: 'Attended Patients', path: '/doctor/patients' },
  { icon: User, label: 'My Profile', path: '/doctor/profile' },
];

const DoctorLayout = () => {
  return <DashboardLayout sidebarItems={sidebarItems} />;
};

export default DoctorLayout;
