import React from 'react';
import { useQuery } from '@tanstack/react-query';
import dashboardService from '../../services/dashboardService';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/ui/DataTable';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import { Calendar, FileText, Activity } from 'lucide-react';

const PatientOverview = () => {
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['patientStats'],
    queryFn: dashboardService.getPatientStats,
  });

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const getCleanDoctorName = (val) => {
    if (!val) return 'Dr. Medical Practitioner';
    if (val.includes('@')) {
      const parts = val.split('@')[0];
      const formatted = parts.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `Dr. ${formatted}`;
    }
    return !val.startsWith('Dr.') ? `Dr. ${val}` : val;
  };

  const columns = [
    {
      label: 'Doctor',
      key: 'doctorName',
      render: (val) => <span className="font-bold text-slate-900">{getCleanDoctorName(val)}</span>
    },
    { label: 'Date & Time', key: 'appointmentDate', render: (val) => (val ? new Date(val).toLocaleString() : 'N/A') },
    { label: 'Reason', key: 'reason' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'CONFIRMED' ? 'success' : val === 'PENDING' ? 'warning' : 'default'}>
          {val || 'PENDING'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Health Portal</h1>
        <p className="text-xs text-slate-500 mt-1">Track upcoming consultations, prescriptions, and health records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Upcoming Appointments"
          value={stats?.upcomingAppointmentsCount || 0}
          icon={Calendar}
          color="primary"
        />
        <StatsCard
          title="Active Prescriptions"
          value={stats?.totalPrescriptions || 0}
          icon={FileText}
          color="success"
        />
        <StatsCard
          title="Total Hospital Visits"
          value={stats?.totalVisits || 0}
          icon={Activity}
          color="secondary"
        />
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900">Upcoming Appointments</h3>
        <DataTable
          columns={columns}
          data={stats?.upcomingAppointments || []}
          emptyMessage="No upcoming consultations scheduled."
        />
      </div>
    </div>
  );
};

export default PatientOverview;
