import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'patients'

  const { data: doctors, isLoading: docsLoading, isError: docsErr, refetch: refetchDocs } = useQuery({
    queryKey: ['adminUsersDoctors'],
    queryFn: adminService.getAllDoctors,
  });

  const { data: patients, isLoading: patsLoading, isError: patsErr, refetch: refetchPats } = useQuery({
    queryKey: ['adminUsersPatients'],
    queryFn: adminService.getAllPatients,
  });

  if (docsLoading || patsLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (docsErr || patsErr) return <ErrorState onRetry={() => { refetchDocs(); refetchPats(); }} />;

  const filteredDoctors = (doctors || []).filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPatients = (patients || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const doctorColumns = [
    { label: 'Practitioner Name', key: 'name' },
    { label: 'Email Address', key: 'email' },
    { label: 'Specialization', key: 'specialization' },
    { label: 'Degree', key: 'degree' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'APPROVED' ? 'success' : 'warning'}>
          {val || 'PENDING'}
        </Badge>
      ),
    },
  ];

  const patientColumns = [
    { label: 'Patient Name', key: 'name' },
    { label: 'Contact Phone', key: 'phone' },
    { label: 'Age', key: 'age' },
    { label: 'Gender', key: 'gender' },
    { label: 'Blood Group', key: 'bloodGroup', render: (val) => val || 'Not Specified' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System User Directory</h1>
          <p className="text-xs text-slate-500 font-medium">Manage and audit registered doctors and patient accounts</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search user directory..." />
      </div>

      {/* Role Directory Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'doctors'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Clinical Doctors ({doctors?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'patients'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Registered Patients ({patients?.length || 0})
        </button>
      </div>

      {activeTab === 'doctors' ? (
        <DataTable columns={doctorColumns} data={filteredDoctors} emptyMessage="No doctor accounts found." />
      ) : (
        <DataTable columns={patientColumns} data={filteredPatients} emptyMessage="No patient accounts found." />
      )}
    </div>
  );
};

export default UserManagement;
