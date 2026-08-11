import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { LayoutDashboard, Calendar, Stethoscope, Pill, FileText, User } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/patient' },
  { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
  { icon: Stethoscope, label: 'Find Doctors', path: '/patient/doctors' },
  { icon: Pill, label: 'Prescriptions', path: '/patient/prescriptions' },
  { icon: FileText, label: 'Medical Records', path: '/patient/medical-records' },
  { icon: User, label: 'Profile', path: '/patient/profile' },
];

const PatientLayout = () => {
  return <DashboardLayout sidebarItems={sidebarItems} />;
};

export default PatientLayout;
