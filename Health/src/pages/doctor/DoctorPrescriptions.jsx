import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import doctorService from '../../services/doctorService';
import prescriptionService from '../../services/prescriptionService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import PrescriptionReceipt from '../../components/ui/PrescriptionReceipt';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

const DoctorPrescriptions = () => {
  const [search, setSearch] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isNewRxModalOpen, setIsNewRxModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const queryClient = useQueryClient();

  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctorAppointments'],
    queryFn: doctorService.getAppointments,
  });

  const { data: doctorPatients } = useQuery({
    queryKey: ['doctorPatientsListRx'],
    queryFn: doctorService.getDoctorPatients,
  });

  const { data: directPrescriptions } = useQuery({
    queryKey: ['doctorDirectPrescriptions'],
    queryFn: prescriptionService.getDoctorPrescriptions,
  });

  const createRxMutation = useMutation({
    mutationFn: prescriptionService.createPrescription,
    onSuccess: () => {
      toast.success('Prescription created and sent to patient!');
      queryClient.invalidateQueries({ queryKey: ['doctorDirectPrescriptions'] });
      setIsNewRxModalOpen(false);
      setFormData({ patientId: '', medication: '', dosage: '', frequency: '', duration: '', instructions: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create prescription.');
    },
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const completedAppointments = (appointments || []).filter((a) => a.status === 'COMPLETED');

  const filtered = completedAppointments.filter((a) => {
    const term = search.toLowerCase();
    const docName = a.patient?.username?.toLowerCase() || '';
    const diag = a.diagnosis?.toLowerCase() || '';
    return docName.includes(term) || diag.includes(term);
  });

  const columns = [
    { label: 'Patient Name', key: 'patient', render: (val) => val?.username || 'N/A' },
    { label: 'Diagnosis', key: 'diagnosis' },
    {
      label: 'Consultation Date',
      key: 'appointmentDate',
      render: (val) => (val ? new Date(val).toLocaleDateString() : 'N/A'),
    },
    {
      label: 'Prescription PDF',
      key: 'id',
      render: (id, row) => (
        <Button
          size="sm"
          variant="outline"
          icon={FileText}
          onClick={() => {
            setCurrentAppointment(row);
            setIsPdfModalOpen(true);
          }}
        >
          View Receipt
        </Button>
      ),
    },
  ];

  const patientOptions = [
    { value: '', label: 'Select Patient' },
    ...(doctorPatients || []).map((p) => ({
      value: p.id,
      label: `${p.username || 'Patient'} (ID: ${p.id})`,
    })),
  ];

  const handleCreateRx = (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error('Please select a patient.');
      return;
    }
    createRxMutation.mutate({
      patientId: Number(formData.patientId),
      medication: formData.medication.trim(),
      dosage: formData.dosage.trim(),
      frequency: formData.frequency.trim(),
      duration: formData.duration.trim(),
      instructions: formData.instructions.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Prescriptions Archive</h1>
          <p className="text-xs text-slate-500 font-medium">View and issue prescriptions for patients</p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search patient or diagnosis..." />
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsNewRxModalOpen(true)}>
            Issue Prescription
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No prescriptions have been issued yet." />

      {/* View PDF Modal */}
      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="Prescription Document" size="2xl">
        <PrescriptionReceipt appointment={currentAppointment} />
      </Modal>

      {/* Issue Prescription Modal */}
      <Modal isOpen={isNewRxModalOpen} onClose={() => setIsNewRxModalOpen(false)} title="Issue Direct Prescription">
        <form onSubmit={handleCreateRx} className="space-y-4">
          <Select
            label="Patient"
            options={patientOptions}
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
          />
          <Input
            label="Medication Name"
            value={formData.medication}
            onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
            placeholder="e.g. Amoxicillin 500mg"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g. 1 Tablet"
              required
            />
            <Input
              label="Frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              placeholder="e.g. Twice Daily"
              required
            />
            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 5 Days"
              required
            />
          </div>
          <Input
            label="Instructions / Notes"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Take after meals."
          />
          <Button type="submit" variant="primary" loading={createRxMutation.isPending} className="w-full">
            Issue & Send Prescription
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorPrescriptions;
