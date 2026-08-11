import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';

const PatientManagement = () => {
  const [search, setSearch] = useState('');

  const { data: patients, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminPatients'],
    queryFn: adminService.getAllPatients,
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filteredPatients = (patients || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toLowerCase().includes(search.toLowerCase()) ||
      p.bloodGroup?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { label: 'Patient Name', key: 'name' },
    { label: 'Phone Number', key: 'phone' },
    { label: 'Age', key: 'age' },
    { label: 'Gender', key: 'gender' },
    {
      label: 'Blood Group',
      key: 'bloodGroup',
      render: (val) => <Badge variant="info">{val || 'N/A'}</Badge>,
    },
    { label: 'Emergency Contact', key: 'emergencyContact' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-1">View registered patient demographics and medical profiles</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search patient by name or phone..." />
      </div>

      <DataTable columns={columns} data={filteredPatients} emptyMessage="No patient records found." />
    </div>
  );
};

export default PatientManagement;
