import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import doctorService from '../../services/doctorService';
import api from '../../lib/api';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import PrescriptionReceipt from '../../components/ui/PrescriptionReceipt';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { MEDICINES_LIST, DOSAGE_OPTIONS, FREQUENCY_OPTIONS, DURATION_OPTIONS } from '../../constants/medicineList';
import { Filter, RotateCcw, FileText, FileSignature, CheckCircle, Ban, Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const DoctorAppointments = () => {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Confirm Modals state
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);

  // Medical Record & Prescription Form state
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [medicines, setMedicines] = useState([
    { name: 'Paracetamol 500mg / Dolo 650', dosage: '1 tablet', frequency: 'Twice a day (1-0-1) - Morning & Night', duration: '5 days' }
  ]);

  // Track appointments that have had medical records attached in UI state
  const [recordedAppointmentIds, setRecordedAppointmentIds] = useState(new Set());

  const queryClient = useQueryClient();

  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctorAppointments'],
    queryFn: doctorService.getAppointments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => doctorService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      toast.success('Appointment status updated!');
      queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] });
    },
    onError: () => toast.error('Failed to update status.'),
  });

  const saveRecordAndPrescriptionMutation = useMutation({
    mutationFn: async ({ appointment, payload }) => {
      // 1. Save medical record to backend
      if (appointment?.patient?.id) {
        try {
          await api.post('/api/medical-records', {
            patientId: appointment.patient.id,
            diagnosis: payload.diagnosis,
            treatment: payload.prescriptionDetails,
            doctorNotes: payload.doctorNotes,
            prescription: payload.prescriptionDetails,
            recordDate: new Date().toISOString().split('T')[0]
          });
        } catch (e) {
          console.warn('Medical record endpoint warning:', e);
        }
      }

      // 2. Save prescription details onto appointment
      const res = await api.put(`/api/doctor/appointments/${appointment.id}/complete`, {
        diagnosis: payload.diagnosis,
        prescriptionDetails: payload.prescriptionDetails
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Medical Record & Prescription attached successfully!');
      setRecordedAppointmentIds(prev => new Set(prev).add(variables.appointment.id));
      queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] });
      setIsPrescriptionModalOpen(false);
    },
    onError: () => toast.error('Failed to attach medical record & prescription.'),
  });

  const completeAppointmentMutation = useMutation({
    mutationFn: async (id) => {
      const target = (appointments || []).find(a => a.id === id);
      const payload = {
        diagnosis: target?.diagnosis || 'Routine Consultation Completed',
        prescriptionDetails: target?.prescriptionDetails || 'Prescription Issued'
      };
      const res = await api.put(`/api/doctor/appointments/${id}/complete`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Appointment marked as COMPLETED!');
      queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] });
    },
    onError: () => toast.error('Failed to complete appointment.'),
  });

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filtered = (appointments || []).filter((a) => {
    const matchesSearch =
      a.patient?.username?.toLowerCase().includes(search.toLowerCase()) ||
      a.reason?.toLowerCase().includes(search.toLowerCase());

    let matchesDate = true;
    if (selectedDate && a.appointmentDate) {
      const dateStr = typeof a.appointmentDate === 'string'
        ? a.appointmentDate.split('T')[0]
        : new Date(a.appointmentDate).toISOString().split('T')[0];
      matchesDate = dateStr === selectedDate;
    }

    let matchesDay = true;
    if (selectedDay && a.appointmentDate) {
      const d = new Date(a.appointmentDate);
      const dayName = daysOfWeek[d.getDay()];
      matchesDay = dayName.toLowerCase() === selectedDay.toLowerCase();
    }

    let matchesStatus = true;
    if (selectedStatus) {
      matchesStatus = (a.status || 'CONFIRMED').toUpperCase() === selectedStatus.toUpperCase();
    }

    return matchesSearch && matchesDate && matchesDay && matchesStatus;
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedDate('');
    setSelectedDay('');
    setSelectedStatus('');
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: MEDICINES_LIST[0], dosage: DOSAGE_OPTIONS[0], frequency: FREQUENCY_OPTIONS[0], duration: DURATION_OPTIONS[0] }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const handleSubmitMedicalRecord = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error('Diagnosis is required.');
      return;
    }

    const payload = {
      diagnosis: diagnosis.trim(),
      doctorNotes: doctorNotes.trim(),
      prescriptionDetails: JSON.stringify(medicines)
    };

    saveRecordAndPrescriptionMutation.mutate({ appointment: currentAppointment, payload });
  };

  const hasRecordAttached = (row) => {
    return (
      recordedAppointmentIds.has(row.id) ||
      (row.prescriptionDetails && row.prescriptionDetails.length > 5) ||
      (row.diagnosis && row.diagnosis.length > 2)
    );
  };

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
      label: 'Patient Log',
      key: 'patient',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{getCleanPatientName(val || row.patient)}</div>
          <div className="text-[10px] text-blue-600 font-semibold">Ref ID: #{row.id}</div>
        </div>
      ),
    },
    {
      label: 'Date & Shift',
      key: 'appointmentDate',
      render: (val) => {
        if (!val) return 'N/A';
        const d = new Date(val);
        const dayName = daysOfWeek[d.getDay()];
        return (
          <div>
            <div className="font-bold text-slate-800">{d.toLocaleDateString()}</div>
            <div className="text-xs text-sky-600 font-semibold">{dayName} at {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        );
      },
    },
    { label: 'Reason for Visit', key: 'reason' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'CONFIRMED' ? 'success' : val === 'COMPLETED' ? 'primary' : val === 'CANCELLED' ? 'error' : 'warning'}>
          {val || 'CONFIRMED'}
        </Badge>
      ),
    },
    {
      label: 'Clinical Items',
      key: 'id',
      render: (id, row) => {
        const recordIsAttached = hasRecordAttached(row);
        const isCompleted = row.status === 'COMPLETED';
        const isCancelled = row.status === 'CANCELLED';

        return (
          <div className="flex items-center space-x-2">
            {!isCompleted && !isCancelled && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  icon={FileSignature}
                  onClick={() => {
                    setCurrentAppointment(row);
                    setDiagnosis(row.diagnosis || row.reason || '');
                    setDoctorNotes('');
                    setIsPrescriptionModalOpen(true);
                  }}
                >
                  {recordIsAttached ? 'Edit Record' : '+ Add Record & RX'}
                </Button>

                <Button
                  size="sm"
                  variant="success"
                  icon={CheckCircle}
                  disabled={!recordIsAttached}
                  title={!recordIsAttached ? 'Please add a medical record & prescription first to enable completion' : 'Mark Completed'}
                  onClick={() => {
                    setAppointmentToComplete(id);
                    setIsConfirmCompleteOpen(true);
                  }}
                >
                  Mark Completed
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  icon={Ban}
                  onClick={() => {
                    setAppointmentToCancel(id);
                    setIsConfirmCancelOpen(true);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}

            {isCompleted && (
              <div className="flex items-center space-x-2">
                <Badge variant="primary" className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Completed</span>
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  icon={FileText}
                  onClick={() => {
                    setCurrentAppointment(row);
                    setIsPdfModalOpen(true);
                  }}
                >
                  View Prescription PDF
                </Button>
              </div>
            )}

            {isCancelled && (
              <span className="text-xs text-rose-500 italic font-medium">Cancelled</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Appointments Console</h1>
          <p className="text-xs text-slate-500 font-medium">Manage clinical visits, attach prescriptions, and log attended patients</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search patient or reason..." />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-blue-600" /> Filter Schedule
          </span>
          {(selectedDate || selectedDay || selectedStatus || search) && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Filter by Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl py-2 px-3 outline-none focus:border-blue-600 font-semibold"
            />
          </div>

          <Select
            label="Filter by Day (Mon - Sun)"
            options={[
              { value: '', label: 'All Days (Mon - Sun)' },
              { value: 'Monday', label: 'Monday' },
              { value: 'Tuesday', label: 'Tuesday' },
              { value: 'Wednesday', label: 'Wednesday' },
              { value: 'Thursday', label: 'Thursday' },
              { value: 'Friday', label: 'Friday' },
              { value: 'Saturday', label: 'Saturday' },
              { value: 'Sunday', label: 'Sunday' },
            ]}
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          />

          <Select
            label="Filter by Status"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No appointments match the selected filters." />

      {/* Add Medical Record & Prescription Modal */}
      <Modal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        title={`Add Medical Record & Prescription for ${currentAppointment?.patient?.username || 'Patient'}`}
        size="2xl"
      >
        <form onSubmit={handleSubmitMedicalRecord} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Diagnosis / Primary Observation" 
              value={diagnosis} 
              onChange={(e) => setDiagnosis(e.target.value)} 
              required 
              placeholder="e.g. Acute Upper Respiratory Tract Infection"
            />
            <Input 
              label="Doctor Notes & Clinical Advice" 
              value={doctorNotes} 
              onChange={(e) => setDoctorNotes(e.target.value)} 
              placeholder="e.g. Adequate rest, drink warm fluids, review in 5 days"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Prescribed Medications</h3>
                <p className="text-xs text-slate-400">Select from 100+ standard medicines or type to filter</p>
              </div>
              <Button type="button" size="sm" variant="outline" icon={Plus} onClick={handleAddMedicine}>
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {medicines.map((med, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Medicine #{index + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Searchable Medicine Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select Medicine Name</label>
                    <select
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    >
                      {MEDICINES_LIST.map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dosage, Frequency & Duration Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dosage</label>
                      <select
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl py-1.5 px-2 font-medium"
                      >
                        {DOSAGE_OPTIONS.map((d, idx) => (
                          <option key={idx} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Frequency</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl py-1.5 px-2 font-medium"
                      >
                        {FREQUENCY_OPTIONS.map((f, idx) => (
                          <option key={idx} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration</label>
                      <select
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl py-1.5 px-2 font-medium"
                      >
                        {DURATION_OPTIONS.map((dur, idx) => (
                          <option key={idx} value={dur}>{dur}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button type="submit" variant="primary" loading={saveRecordAndPrescriptionMutation.isPending}>
              Attach Medical Record & Prescription
            </Button>
          </div>
        </form>
      </Modal>

      {/* View PDF Modal */}
      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="Prescription Document" size="2xl">
        <PrescriptionReceipt appointment={currentAppointment} />
      </Modal>

      {/* Cancellation Confirmation Panel */}
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => { setIsConfirmCancelOpen(false); setAppointmentToCancel(null); }}
        onConfirm={() => {
          if (appointmentToCancel) {
            updateStatusMutation.mutate({ id: appointmentToCancel, status: 'CANCELLED' }, {
              onSettled: () => {
                setIsConfirmCancelOpen(false);
                setAppointmentToCancel(null);
              }
            });
          }
        }}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this patient appointment? A notification will be sent to the patient."
        confirmText="Yes, Cancel"
        confirmVariant="danger"
        loading={updateStatusMutation.isPending}
      />

      {/* Completion Confirmation Panel */}
      <ConfirmModal
        isOpen={isConfirmCompleteOpen}
        onClose={() => { setIsConfirmCompleteOpen(false); setAppointmentToComplete(null); }}
        onConfirm={() => {
          if (appointmentToComplete) {
            completeAppointmentMutation.mutate(appointmentToComplete, {
              onSettled: () => {
                setIsConfirmCompleteOpen(false);
                setAppointmentToComplete(null);
              }
            });
          }
        }}
        title="Mark Appointment Completed?"
        message="Confirm closing this consultation? The patient will be logged as attended in your clinical dashboard."
        confirmText="Yes, Complete Consultation"
        confirmVariant="success"
        loading={completeAppointmentMutation.isPending}
      />
    </div>
  );
};

export default DoctorAppointments;
