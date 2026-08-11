import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';

const AppointmentManagement = () => {
  const [search, setSearch] = useState('');

  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAppointments'],
    queryFn: adminService.getAllAppointments,
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = (appointments || []).filter(
    (a) =>
      a.patient?.username?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor?.username?.toLowerCase().includes(search.toLowerCase()) ||
      a.reason?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      label: 'Patient',
      key: 'patient',
      render: (val) => val?.username || 'N/A',
    },
    {
      label: 'Doctor',
      key: 'doctor',
      render: (val) => val?.username || 'N/A',
    },
    { label: 'Date & Time', key: 'appointmentDate' },
    { label: 'Reason', key: 'reason' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'CONFIRMED' ? 'success' : val === 'PENDING' ? 'warning' : 'error'}>
          {val || 'PENDING'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointment Master Roster</h1>
          <p className="text-xs text-slate-500 mt-1">Audit and supervise all system clinical appointments</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by patient, doctor or reason..." />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No appointments found." />
    </div>
  );
};

export default AppointmentManagement;
