import React from 'react';
import { useQuery } from '@tanstack/react-query';
import doctorService from '../../services/doctorService';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/ui/DataTable';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import { Calendar, Users, Pill, CheckCircle2 } from 'lucide-react';

const DoctorOverview = () => {
  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctorOverviewAppointments'],
    queryFn: doctorService.getDoctorAppointments,
  });

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const todayStr = new Date().toISOString().split('T')[0];

  const isToday = (dateVal) => {
    if (!dateVal) return false;
    if (typeof dateVal === 'string') {
      return dateVal.startsWith(todayStr);
    }
    const d = new Date(dateVal);
    return d.toISOString().split('T')[0] === todayStr;
  };

  const todayAppointments = (appointments || []).filter((a) => isToday(a.appointmentDate));
  const completedAppointments = (appointments || []).filter((a) => a.status === 'COMPLETED');
  const activeConfirmed = (appointments || []).filter((a) => a.status === 'CONFIRMED').length;

  const getCleanPatientName = (patient) => {
    if (!patient) return 'Patient';
    if (patient.name) return patient.name;
    const val = patient.username || patient.email || '';
    if (val.includes('@')) {
      const parts = val.split('@')[0];
      return parts.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return val;
  };

  const columns = [
    {
      label: 'Attended Patient Log',
      key: 'patient',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{getCleanPatientName(val || row.patient)}</div>
          <div className="text-[10px] text-blue-600 font-semibold">Ref ID: #{row.id}</div>
        </div>
      ),
    },
    {
      label: 'Consultation Date',
      key: 'appointmentDate',
      render: (val) => (val ? new Date(val).toLocaleString() : 'N/A'),
    },
    { label: 'Reason / Symptom', key: 'reason' },
    {
      label: 'Diagnosis & Record Log',
      key: 'diagnosis',
      render: (val, row) => (
        val ? (
          <div className="text-xs font-semibold text-slate-800">
            <span className="text-blue-600 font-bold">Dx:</span> {val}
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic font-medium">Pending diagnosis</span>
        )
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'CONFIRMED' ? 'success' : val === 'COMPLETED' ? 'primary' : 'warning'}>
          {val || 'CONFIRMED'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Consultation Dashboard</h1>
        <p className="text-xs text-slate-500 font-medium">Overview of attended patients, active appointments, and clinical records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Scheduled Consultations"
          value={todayAppointments.length}
          icon={Calendar}
          color="primary"
        />
        <StatsCard
          title="Active Confirmed Appointments"
          value={activeConfirmed}
          icon={Users}
          color="secondary"
        />
        <StatsCard
          title="Total Attended Patients"
          value={completedAppointments.length}
          icon={Pill}
          color="success"
        />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Patient Consultations & Logs</h3>
          <span className="text-xs text-slate-500 font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <DataTable
          columns={columns}
          data={todayAppointments.length > 0 ? todayAppointments : (appointments || []).slice(0, 10)}
          emptyMessage="No consultation logs found."
        />
      </div>
    </div>
  );
};

export default DoctorOverview;
