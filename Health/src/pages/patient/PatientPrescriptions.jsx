import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import patientService from '../../services/patientService';
import prescriptionService from '../../services/prescriptionService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import PrescriptionReceipt from '../../components/ui/PrescriptionReceipt';
import Badge from '../../components/ui/Badge';
import { FileText, Pill, Printer, Building2 } from 'lucide-react';

const PatientPrescriptions = () => {
  const [search, setSearch] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('consultation'); // 'consultation' | 'direct'

  const { data: appointments, isLoading: appLoading, isError: appErr, refetch: refetchApp } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: patientService.getAppointments,
  });

  const { data: directRx, isLoading: rxLoading, isError: rxErr, refetch: refetchRx } = useQuery({
    queryKey: ['patientDirectPrescriptions'],
    queryFn: prescriptionService.getPatientPrescriptions,
  });

  if (appLoading || rxLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (appErr || rxErr) return <ErrorState onRetry={() => { refetchApp(); refetchRx(); }} />;

  const getCleanDoctorName = (doc) => {
    if (!doc) return 'Dr. Medical Specialist';
    if (doc.name) return doc.name;
    const val = doc.username || doc.email || '';
    if (val.includes('@')) {
      const parts = val.split('@')[0];
      const formatted = parts.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `Dr. ${formatted}`;
    }
    return !val.startsWith('Dr.') ? `Dr. ${val}` : val;
  };

  const completedAppointments = (appointments || []).filter((a) => a.status === 'COMPLETED');

  const filteredConsultations = completedAppointments.filter((a) => {
    const term = search.toLowerCase();
    const docName = getCleanDoctorName(a.doctor).toLowerCase();
    const diag = (a.diagnosis || '').toLowerCase();
    return docName.includes(term) || diag.includes(term);
  });

  const filteredDirect = (directRx || []).filter((r) => {
    const term = search.toLowerCase();
    const med = (r.medication || '').toLowerCase();
    const doc = getCleanDoctorName(r.doctor).toLowerCase();
    return med.includes(term) || doc.includes(term);
  });

  const consultationColumns = [
    {
      label: 'Doctor & Hospital',
      key: 'doctor',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{getCleanDoctorName(val)}</div>
          <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3" />
            {row.doctor?.hospitalName || 'HealthCare+ Medical Center'}
          </div>
        </div>
      )
    },
    {
      label: 'Diagnosis / Observation',
      key: 'diagnosis',
      render: (val, row) => (
        <span className="font-semibold text-slate-800 text-xs">
          {val || row.reason || 'General Medical Consultation'}
        </span>
      )
    },
    {
      label: 'Date Issued',
      key: 'appointmentDate',
      render: (val) => (val ? new Date(val).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'),
    },
    {
      label: 'Official Prescription Receipt',
      key: 'id',
      render: (id, row) => (
        <Button
          size="sm"
          variant="primary"
          icon={Printer}
          onClick={() => {
            setCurrentAppointment(row);
            setIsPdfModalOpen(true);
          }}
        >
          View / Print PDF
        </Button>
      ),
    },
  ];

  const directColumns = [
    {
      label: 'Medication',
      key: 'medication',
      render: (val) => <span className="font-bold text-slate-900">{val}</span>,
    },
    {
      label: 'Prescribing Doctor',
      key: 'doctor',
      render: (val) => getCleanDoctorName(val),
    },
    { label: 'Dosage & Frequency', key: 'dosage', render: (val, row) => `${val} (${row.frequency || 'Daily'})` },
    { label: 'Duration', key: 'duration' },
    { label: 'Instructions', key: 'instructions', render: (val) => val || 'Take as directed' },
    { label: 'Date Issued', key: 'prescribedDate' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val === 'ACTIVE' ? 'success' : 'info'}>{val || 'ACTIVE'}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Prescriptions & Receipts</h1>
          <p className="text-xs text-slate-500 font-medium">Access official medical prescriptions and downloadable PDF receipts</p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search prescription, doctor, or diagnosis..." />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('consultation')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'consultation'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Consultation Prescriptions & Receipts ({completedAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'direct'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Direct Prescriptions ({directRx?.length || 0})
        </button>
      </div>

      {activeTab === 'consultation' ? (
        <DataTable columns={consultationColumns} data={filteredConsultations} emptyMessage="No consultation prescriptions issued yet. Attended consultation prescriptions will appear here with downloadable PDFs." />
      ) : (
        <DataTable columns={directColumns} data={filteredDirect} emptyMessage="No direct prescriptions issued yet." />
      )}

      {/* Prescription PDF Receipt Modal */}
      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="Official Medical Prescription & Receipt" size="2xl">
        <PrescriptionReceipt appointment={currentAppointment} />
      </Modal>
    </div>
  );
};

export default PatientPrescriptions;
