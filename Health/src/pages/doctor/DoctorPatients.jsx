import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import doctorService from '../../services/doctorService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { User, Activity, FileText } from 'lucide-react';

const DoctorPatients = () => {
  const [search, setSearch] = useState('');

  const { data: patients, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctorPatients'],
    queryFn: doctorService.getPatients,
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = (patients || []).filter((p) =>
    (p.username || p.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      label: 'Attended Patient',
      key: 'username',
      render: (val, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{val || row.email || 'Patient'}</div>
            <div className="text-[10px] text-slate-400 font-medium">Patient ID: #{row.id}</div>
          </div>
        </div>
      )
    },
    {
      label: 'Role & Scope',
      key: 'role',
      render: (val) => <Badge variant="primary">PATIENT</Badge>
    },
    {
      label: 'Consultation Status',
      key: 'id',
      render: () => (
        <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <Activity className="w-3 h-3 mr-1" /> Attended Patient
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attended Patients Directory</h1>
          <p className="text-xs text-slate-500 font-medium">Showing patients who have scheduled and attended appointments with you</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search attended patient..." />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No attended patients logged yet. Patients appear here after booking consultations with you." />
    </div>
  );
};

export default DoctorPatients;
