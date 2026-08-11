import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import patientService from '../../services/patientService';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { DoctorProfileModal } from '../../components/patient/DoctorProfileModal';
import { Building2, MapPin, CalendarPlus, UserCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

const PatientDoctors = () => {
  const [search, setSearch] = useState('');
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const queryClient = useQueryClient();
  const todayStr = new Date().toISOString().split('T')[0];

  const { data: doctors, isLoading, isError, refetch } = useQuery({
    queryKey: ['patientApprovedDoctors'],
    queryFn: patientService.getDoctors,
  });

  const bookMutation = useMutation({
    mutationFn: patientService.bookAppointment,
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      setBookingDoctor(null);
      resetBookingForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to book appointment.');
    },
  });

  const resetBookingForm = () => {
    setSelectedDate('');
    setSelectedSlot('');
    setReason('');
  };

  const generateDynamicSlots = (doctor) => {
    const start = doctor?.startTime || '09:30';
    const end = doctor?.endTime || '16:30';
    const morningTitle = doctor?.morningSlot || `Morning Shift (${start})`;
    const afternoonTitle = doctor?.afternoonSlot || `Afternoon Shift (${end})`;

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
      if (m < midPoint) morningSlots.push(slotTime);
      else afternoonSlots.push(slotTime);
    }

    return {
      morningTitle,
      morningSlots: morningSlots.length > 0 ? morningSlots : ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
      afternoonTitle,
      afternoonSlots: afternoonSlots.length > 0 ? afternoonSlots : ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    };
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const filtered = (doctors || []).filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.hospitalName?.toLowerCase().includes(search.toLowerCase())
  );

  const currentSlots = generateDynamicSlots(bookingDoctor);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    if (!selectedDate) {
      toast.error('Please select an appointment date.');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please select a time slot.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please state a reason for consultation.');
      return;
    }

    const isoDateTime = `${selectedDate}T${selectedSlot}:00`;

    bookMutation.mutate({
      doctorId: bookingDoctor.id,
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Find Medical Doctors</h1>
          <p className="text-xs text-slate-500 font-medium">Browse verified practitioners, view profiles, and book appointments</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search doctor, specialty, or hospital..." />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-xs text-slate-500 py-12">No verified doctors match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <Card key={doc.id} className="space-y-4 hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar name={doc.name} size="lg" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{doc.degree}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.hospitalName || 'General Hospital'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.hospitalLocation || 'Main Campus'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={UserCheck}
                  onClick={() => setSelectedDoctorForProfile(doc)}
                >
                  View Profile
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  icon={CalendarPlus}
                  onClick={() => {
                    setBookingDoctor(doc);
                    resetBookingForm();
                  }}
                >
                  Book Slot
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Doctor Profile View Modal (Verification Proof Hidden) */}
      <DoctorProfileModal
        doctor={selectedDoctorForProfile}
        isOpen={!!selectedDoctorForProfile}
        onClose={() => setSelectedDoctorForProfile(null)}
        onBookClick={(doc) => {
          setSelectedDoctorForProfile(null);
          setBookingDoctor(doc);
          resetBookingForm();
        }}
      />

      {/* Direct Booking Modal */}
      <Modal
        isOpen={!!bookingDoctor}
        onClose={() => { setBookingDoctor(null); resetBookingForm(); }}
        title={`Book Appointment with Dr. ${bookingDoctor?.name || ''}`}
        size="lg"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-5">
          <Input
            label="Consultation Date"
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />

          {selectedDate && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                Available Time Slots
              </label>

              {currentSlots.morningSlots.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-blue-700 mb-2">☀️ {currentSlots.morningTitle}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {currentSlots.morningSlots.map(renderSlotButton)}
                  </div>
                </div>
              )}

              {currentSlots.afternoonSlots.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-sky-700 mb-2">🌤️ {currentSlots.afternoonTitle}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {currentSlots.afternoonSlots.map(renderSlotButton)}
                  </div>
                </div>
              )}
            </div>
          )}

          <Input
            label="Reason for Visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your health concern..."
            required
          />

          <Button type="submit" variant="primary" loading={bookMutation.isPending} className="w-full">
            Confirm & Reserve Appointment
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PatientDoctors;
