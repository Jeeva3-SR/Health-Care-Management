import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import medicalRecordService from '../../services/medicalRecordService';
import doctorService from '../../services/doctorService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const DoctorMedicalRecords = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    prescription: '',
    doctorNotes: '',
  });

  const queryClient = useQueryClient();

  const { data: records, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctorRecords'],
    queryFn: medicalRecordService.getDoctorRecords,
  });

  const { data: doctorPatients } = useQuery({
    queryKey: ['doctorPatientsListRec'],
    queryFn: doctorService.getDoctorPatients,
  });

  const createMutation = useMutation({
    mutationFn: medicalRecordService.createRecord,
    onSuccess: () => {
      toast.success('Medical record saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['doctorRecords'] });
      setIsModalOpen(false);
      setFormData({ patientId: '', diagnosis: '', prescription: '', doctorNotes: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to create medical record.');
    },
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = (records || []).filter(
    (r) =>
      r.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorNotes?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { label: 'Date', key: 'recordDate' },
    { label: 'Diagnosis', key: 'diagnosis' },
    { label: 'Prescription Summary', key: 'prescription' },
    { label: 'Clinical Notes', key: 'doctorNotes' },
  ];

  const patientOptions = [
    { value: '', label: 'Select Registered Patient' },
    ...(doctorPatients || []).map((p) => ({
      value: p.id,
      label: `${p.username || 'Patient'} (ID: ${p.id})`,
    })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error('Please select a patient.');
      return;
    }
    createMutation.mutate({
      patientId: Number(formData.patientId),
      diagnosis: formData.diagnosis.trim(),
      prescription: formData.prescription.trim(),
      doctorNotes: formData.doctorNotes.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Medical Records</h1>
          <p className="text-xs text-slate-500 font-medium">Clinical consultation logs and diagnosis notes</p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search diagnosis or notes..." />
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
            New Medical Record
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No medical records logged yet." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Clinical Medical Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Patient"
            options={patientOptions}
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
          />
          <Input
            label="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            placeholder="e.g. Acute Bronchitis"
            required
          />
          <Input
            label="Prescription Summary"
            value={formData.prescription}
            onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
            placeholder="e.g. Inhaler twice daily"
          />
          <Input
            label="Clinical Notes"
            value={formData.doctorNotes}
            onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
            placeholder="Patient advised rest and hydration."
          />
          <Button type="submit" variant="primary" loading={createMutation.isPending} className="w-full">
            Save Clinical Record
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorMedicalRecords;
