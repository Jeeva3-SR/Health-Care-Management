import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import patientService from '../../services/patientService';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import PrescriptionReceipt from '../../components/ui/PrescriptionReceipt';
import { CalendarPlus, Clock, FileText } from 'lucide-react';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { toast } from 'sonner';

const PatientAppointments = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const queryClient = useQueryClient();
  const todayStr = new Date().toISOString().split('T')[0];

  const { data: appointments, isLoading, isError, refetch } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: patientService.getAppointments,
  });

  const { data: doctors } = useQuery({
    queryKey: ['patientDoctorsList'],
    queryFn: patientService.getDoctors,
  });

  const selectedDoctorObj = (doctors || []).find((d) => String(d.id) === String(selectedDoctorId));

  const generateDynamicSlots = (doctor) => {
    const start = doctor?.startTime || '09:30';
    const end = doctor?.endTime || '16:30';
    const morningTitle = doctor?.morningSlot || `Morning Shift (From ${start})`;
    const afternoonTitle = doctor?.afternoonSlot || `Afternoon Shift (Until ${end})`;

    const parseTime = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const startMins = parseTime(start);
    const endMins = parseTime(end);
    
    const midPoint = Math.floor((startMins + endMins) / 2 / 30) * 30;
    
    const morningSlots = [];
    const afternoonSlots = [];

    for (let m = startMins; m < endMins; m += 30) {
      if (m >= midPoint && m < midPoint + 60) continue; 
      
      const hh = Math.floor(m / 60).toString().padStart(2, '0');
      const mm = (m % 60).toString().padStart(2, '0');
      const slotTime = `${hh}:${mm}`;

      if (m < midPoint) {
        morningSlots.push(slotTime);
      } else {
        afternoonSlots.push(slotTime);
      }
    }

    return {
      morningTitle,
      morningSlots: morningSlots.length > 0 ? morningSlots : ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
      afternoonTitle,
      afternoonSlots: afternoonSlots.length > 0 ? afternoonSlots : ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    };
  };

  const currentSlots = generateDynamicSlots(selectedDoctorObj);

  const bookMutation = useMutation({
    mutationFn: patientService.bookAppointment,
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to book appointment.');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: patientService.cancelAppointment,
    onSuccess: () => {
      toast.success('Appointment cancelled.');
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
    },
    onError: () => toast.error('Failed to cancel appointment.'),
  });

  const resetForm = () => {
    setSelectedDoctorId('');
    setSelectedDate('');
    setSelectedSlot('');
    setReason('');
  };

  if (isLoading) return <LoadingSkeleton variant="table" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = (appointments || []).filter((a) => {
    const docName = (a.doctor?.username || a.doctor?.email || '').toLowerCase();
    const reasonText = (a.reason || '').toLowerCase();
    const term = search.toLowerCase();
    return docName.includes(term) || reasonText.includes(term);
  });

  const columns = [
    {
      label: 'Doctor',
      key: 'doctor',
      render: (val) => val?.username || val?.email || 'N/A',
    },
    {
      label: 'Date & Time',
      key: 'appointmentDate',
      render: (val) => (val ? new Date(val).toLocaleString() : 'N/A'),
    },
    { label: 'Reason for Visit', key: 'reason' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <Badge variant={val === 'CONFIRMED' ? 'success' : val === 'COMPLETED' ? 'primary' : val === 'CANCELLED' ? 'error' : 'warning'}>
          {val || 'PENDING'}
        </Badge>
      ),
    },
    {
      label: 'Action',
      key: 'id',
      render: (id, row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'COMPLETED' && (
            <Button
              size="sm"
              variant="outline"
              icon={FileText}
              onClick={() => {
                setCurrentAppointment(row);
                setIsPdfModalOpen(true);
              }}
            >
              View PDF
            </Button>
          )}
          {row.status !== 'CANCELLED' && row.status !== 'COMPLETED' ? (
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setAppointmentToCancel(id);
                setIsConfirmCancelOpen(true);
              }}
            >
              Cancel
            </Button>
          ) : row.status !== 'COMPLETED' ? (
            <span className="text-xs text-slate-400 italic font-medium">No action</span>
          ) : null}
        </div>
      ),
    },
  ];

  const doctorOptions = [
    { value: '', label: 'Choose Medical Specialist' },
    ...(doctors || []).map((d) => ({
      value: d.id,
      label: `Dr. ${d.name || d.email} (${d.specialization} | ${d.startTime || '09:30'}-${d.endTime || '16:30'})`,
    })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      toast.error('Please select a doctor.');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select an appointment date.');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please choose an available time slot.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for the consultation.');
      return;
    }

    const isoDateTime = `${selectedDate}T${selectedSlot}:00`;

    bookMutation.mutate({
      doctorId: Number(selectedDoctorId),
      appointmentDate: isoDateTime,
      reason: reason.trim(),
    });
  };

  const renderSlotButton = (slot) => {
    const isSelected = selectedSlot === slot;
    const [h, m] = slot.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayTime = `${displayHour}:${m} ${suffix}`;

    return (
      <button
        key={slot}
        type="button"
        onClick={() => setSelectedSlot(slot)}
        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-105'
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
        }`}
      >
        {displayTime}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Appointments</h1>
          <p className="text-xs text-slate-500 font-medium">Book consultations during official doctor shifts</p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by doctor or reason..." />
          <Button variant="primary" size="md" icon={CalendarPlus} onClick={() => setIsModalOpen(true)}>
            Book Appointment
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No appointments scheduled yet." />

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title="Schedule Clinical Appointment" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Select Medical Practitioner"
            options={doctorOptions}
            value={selectedDoctorId}
            onChange={(e) => { setSelectedDoctorId(e.target.value); setSelectedSlot(''); }}
            required
          />

          <Input
            label="Consultation Date"
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />

          {selectedDoctorId && selectedDate && (
            <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                Select Available Consultation Time Slot
              </label>

              {currentSlots.morningSlots.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">
                    ☀️ {currentSlots.morningTitle}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {currentSlots.morningSlots.map(renderSlotButton)}
                  </div>
                </div>
              )}

              {currentSlots.afternoonSlots.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-sky-700 mb-2 flex items-center gap-1">
                    🌤️ {currentSlots.afternoonTitle}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {currentSlots.afternoonSlots.map(renderSlotButton)}
                  </div>
                </div>
              )}
            </div>
          )}

          <Input
            label="Reason for Consultation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Follow-up consultation or Routine checkup"
            required
          />

          <Button type="submit" variant="primary" loading={bookMutation.isPending} className="w-full">
            Confirm & Reserve Appointment
          </Button>
        </form>
      </Modal>

      {/* View PDF Modal */}
      <Modal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title="Prescription Document" size="2xl">
        <PrescriptionReceipt appointment={currentAppointment} />
      </Modal>

      {/* Cancellation Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => { setIsConfirmCancelOpen(false); setAppointmentToCancel(null); }}
        onConfirm={() => {
          if (appointmentToCancel) {
            cancelMutation.mutate(appointmentToCancel, {
              onSettled: () => {
                setIsConfirmCancelOpen(false);
                setAppointmentToCancel(null);
              }
            });
          }
        }}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? Your doctor will be notified immediately."
        confirmText="Yes, Cancel Appointment"
        confirmVariant="danger"
        loading={cancelMutation.isPending}
      />
    </div>
  );
};

export default PatientAppointments;
