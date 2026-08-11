import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import medicalRecordService from '../../services/medicalRecordService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';

const PatientMedicalHistory = () => {
  const [search, setSearch] = useState('');

  const { data: records, isLoading, isError, refetch } = useQuery({
    queryKey: ['patientRecords'],
    queryFn: medicalRecordService.getPatientRecords,
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = (records || []).filter(
    (r) =>
      r.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorNotes?.toLowerCase().includes(search.toLowerCase()) ||
      (r.doctor?.name && r.doctor.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.doctorName && r.doctorName.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    { label: 'Date', key: 'recordDate' },
    {
      label: 'Doctor',
      key: 'doctor',
      render: (val, row) => row.doctor?.name || row.doctorName || 'Dr. Practitioner',
    },
    { label: 'Diagnosis', key: 'diagnosis' },
    { label: 'Prescription Summary', key: 'prescription' },
    { label: 'Clinical Notes', key: 'doctorNotes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical History</h1>
          <p className="text-xs text-slate-500 mt-1">Archived diagnosis reports and clinical consultation history</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search diagnosis or doctor..." />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No medical history records available." />
    </div>
  );
};

export default PatientMedicalHistory;
